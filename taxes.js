/* ========================== 2025 CONSTANTS =============================== */
const WAGE_BASE = 176_100;   // 2025 Social-Security wage cap

const STD_DED = { MFJ: 30000, HOH: 22500, S: 15000, MFS: 15000 };           // standard deduction
const MED_SUR = { MFJ: 250000, HOH: 200000, S: 200000, MFS: 125000 };       // NIIT & Med-surtax thresh
const QBI_PH  = {                                                         // QBI phase-out band
  MFJ : { lo: 383900, hi: 483900 },
  HOH : { lo: 191950, hi: 241950 },
  S   : { lo: 191950, hi: 241950 },
  MFS : { lo: 191950, hi: 241950 }
};

const BRACKETS = {                         // ordinary-income brackets, 2025
  MFJ : [[ 23850, .10 ], [  96950, .12 ], [ 206700, .22 ], [ 394600, .24 ],
         [501050, .32 ], [ 751600, .35 ], [ Infinity, .37 ]],
  HOH : [[ 17000, .10 ], [  64850, .12 ], [ 103350, .22 ], [ 197300, .24 ],
         [250500, .32 ], [ 626350, .35 ], [ Infinity, .37 ]],
  S   : [[ 11925, .10 ], [  48475, .12 ], [ 103350, .22 ], [ 197300, .24 ],
         [250525, .32 ], [ 626350, .35 ], [ Infinity, .37 ]],
  MFS : [[ 11925, .10 ], [  48475, .12 ], [ 103350, .22 ], [ 197300, .24 ],
         [250525, .32 ], [ 626350, .35 ], [ Infinity, .37 ]]
};

const PERIOD = {                            // months in the quarter & months elapsed YTD
  Q1: { months: 3, elapsed:  3 },
  Q2: { months: 2, elapsed:  5 },
  Q3: { months: 3, elapsed:  8 },
  Q4: { months: 4, elapsed: 12 }
};

/* ============================ HELPERS ==================================== */
const f = n => Math.ceil(n).toLocaleString();          // round-up + commas
const p = n => n === null ? "—" : n.toFixed(1) + " %";

function bracketTax(t, tbl) {
  let tax = 0, last = 0;
  for (const [edge, rate] of tbl) {
    if (t <= last) break;
    tax += (Math.min(t, edge) - last) * rate;
    last = edge;
  }
  return tax;
}

/* ============================== MAIN ===================================== */
function calculateTaxEstimate({
  status,      // 'MFJ', 'HOH', 'S', 'MFS'
  quarter,     // 'Q1', 'Q2', 'Q3', 'Q4'
  qGross,      // YTD 1099 income (renamed from quarterly to YTD)
  qExp,        // YTD expenses (renamed from quarterly to YTD)
  w2SCorpYTD,  // YTD S-Corp W-2 wages
  w2OtherYTD,  // YTD other W-2 wages
  withYTD,     // YTD withholding
  otherInc     // Other projected income
}) {
  const monthsQ  = PERIOD[quarter].months;      // length of *this* quarter
  const monthsEL = PERIOD[quarter].elapsed;     // months elapsed YTD

  // Note: qGross and qExp are now YTD inputs, not quarterly
  const yGross = qGross;  // YTD 1099 gross
  const yExp   = qExp;    // YTD expenses

  /* ---- 1. Annualise business profit ---- */
  const yProfit        = Math.max(yGross - yExp, 0);       // profit YTD
  const annProfitGross = yProfit * (12 / monthsEL);        // before S-corp salary adjustment

  /* ---- 2. Annualise W-2 wages ---- */
  const annW2SCorp = w2SCorpYTD * (12 / monthsEL);
  const annW2Other = w2OtherYTD * (12 / monthsEL);

  /* ---- 3. Remove S-corp salary from business profit ---- */
  const annProfitNet = Math.max(annProfitGross - annW2SCorp, 0);

  /* ---- 4. Total projected income ---- */
  const annualGross = annProfitNet + annW2SCorp + annW2Other + otherInc;

  /* ---- 5. Self-employment tax ---- */
  const seTaxApplies = w2SCorpYTD === 0;     // S-corp salary wipes out SE tax
  let seTax = 0, halfSE = 0;
  if (seTaxApplies) {
    const seBase    = annProfitNet * 0.9235;
    const ssCapLeft = Math.max(WAGE_BASE - (annW2SCorp + annW2Other), 0);
    seTax += Math.min(seBase, ssCapLeft) * 0.124;         // Social Security
    seTax += seBase * 0.029;                              // Medicare
    if (seBase > MED_SUR[status])                         // Additional 0.9 %
      seTax += (seBase - MED_SUR[status]) * 0.009;
    halfSE = seTax / 2;                                   // above-the-line deduction
  }

  /* ---- 6. QBI deduction ---- */
  const qbiBase = Math.max(annProfitNet - halfSE, 0);
  const qbi20   = qbiBase * 0.20;
  const preQBI  = Math.max(annualGross - halfSE - STD_DED[status], 0);
  const { lo, hi } = QBI_PH[status];
  let qbiDed;
  if (preQBI >= hi)            qbiDed = 0;                               // phased out
  else if (preQBI > lo)        qbiDed = qbi20 * (1 - (preQBI - lo)/(hi - lo));
  else                         qbiDed = Math.min(qbi20, preQBI * 0.20);

  /* ---- 7. Ordinary-income tax ---- */
  const taxable = Math.max(preQBI - qbiDed, 0);
  const incTax  = bracketTax(taxable, BRACKETS[status]);

  /* ---- 8. Project withholding (annualised from YTD) ---- */
  const projWith = withYTD * (12 / monthsEL);

  /* ---- 9. Quarterly payment ---- */
  const grossTax = incTax + seTax;                      // projected *full-year* tax
  const netTax   = Math.max(grossTax - projWith, 0);    // after projected withholding
  const qFactor  = 12 / monthsQ;                        // 4, 6, 4, 3
  const payment  = Math.ceil(netTax / qFactor / 10) * 10;

  /* ---- 9b. Cumulative targets and partial-year tax ---- */
  const shouldHavePaid = Math.ceil(netTax * (monthsEL / 12) / 10) * 10;
  const partialTax     = Math.round(grossTax * (monthsEL / 12));

  /* ---- 10. Output ---- */
  const effRate   = annualGross > 0 ? (grossTax / annualGross) * 100 : null;
  const labelToDt = { Q1: "Q1",
                      Q2: "Q1 + Q2",
                      Q3: "Q1 + Q2 + Q3",
                      Q4: "all 4 quarters" }[quarter];

  // Helper to round to 2 decimals
  const r2 = v => Number(v.toFixed(2));

  return {
    quarter,
    amountToPay: r2(payment),
    targetPaidThrough: r2(shouldHavePaid),
    projectedTaxLiabilityThrough: r2(partialTax),
    projectedFederalTax: r2(Math.round(grossTax)),
    effectiveTaxRate: effRate === null ? null : r2(effRate),
    labelToDt: labelToDt,
    detail: {
      ytdBusinessProfit: r2(yProfit),
      annualisedBusinessProfitNet: r2(annProfitNet),
      annualisedW2SCorp: r2(annW2SCorp),
      annualisedW2Other: r2(annW2Other),
      otherProjectedIncome: r2(otherInc),
      taxableIncomeAfterQBI: r2(taxable),
      qbiDeduction: r2(qbiDed),
      ordinaryIncomeTax: r2(incTax),
      selfEmploymentTax: r2(seTax),
      projectedWithholding: r2(projWith)
    }
  };
}

// Refactored for Node.js
function runCalcNode(input) {
  const result = calculateTaxEstimate(input);
  const f = n => Math.ceil(n).toLocaleString();
  const p = n => n===null ? "—" : n.toFixed(1)+" %";
  console.log(
`================  ${result.quarter} FEDERAL ESTIMATE  ================

Amount to pay this quarter .............  $${f(result.amountToPay)}
Target paid through ${result.labelToDt} ........  $${f(result.targetPaidThrough)}

Projected tax liability through ${result.labelToDt} ...  $${f(result.projectedTaxLiabilityThrough)}
Projected 2025 federal tax (all year) ...  $${f(result.projectedFederalTax)}
Effective tax rate (proj) ...............  ${p(result.effectiveTaxRate)}

----------------  DETAIL  ----------------
YTD business profit .....................  $${f(result.detail.ytdBusinessProfit)}
Annualised business profit (net) ........  $${f(result.detail.annualisedBusinessProfitNet)}
Annualised W-2 salary (S-corp) ..........  $${f(result.detail.annualisedW2SCorp)}
Annualised W-2 wages (other) ............  $${f(result.detail.annualisedW2Other)}
Other projected income ..................  $${f(result.detail.otherProjectedIncome)}
Taxable income after QBI ................  $${f(result.detail.taxableIncomeAfterQBI)}
QBI deduction ...........................  $${f(result.detail.qbiDeduction)}
Ordinary income tax .....................  $${f(result.detail.ordinaryIncomeTax)}
Self-employment tax .....................  $${f(result.detail.selfEmploymentTax)}
Projected 2025 withholding .............. –$${f(result.detail.projectedWithholding)}
================================================`
  );
}

// Sample data for demonstration (now using YTD inputs)
if (require.main === module) {
  runCalcNode({
    status: 'S',         
    quarter: 'Q2',       
    qGross: 30000,       // YTD 1099 gross (was quarterly)
    qExp: 7500,          // YTD expenses (was quarterly)
    w2SCorpYTD: 0,       
    w2OtherYTD: 16667,   // YTD other wages
    withYTD: 3333,       // YTD withholding
    otherInc: 5000       
  });
}

function formatTaxEstimate(result) {
  const f = n => Math.ceil(n).toLocaleString();
  const p = n => n === null ? "—" : n.toFixed(1) + " %";
  return (
`================  ${result.quarter} FEDERAL ESTIMATE  ================

Amount to pay this quarter .............  $${f(result.amountToPay)}
Target paid through ${result.labelToDt} ........  $${f(result.targetPaidThrough)}

Projected tax liability through ${result.labelToDt} ...  $${f(result.projectedTaxLiabilityThrough)}
Projected 2025 federal tax (all year) ...  $${f(result.projectedFederalTax)}
Effective tax rate (proj) ...............  ${p(result.effectiveTaxRate)}

----------------  DETAIL  ----------------
YTD business profit .....................  $${f(result.detail.ytdBusinessProfit)}
Annualised business profit (net) ........  $${f(result.detail.annualisedBusinessProfitNet)}
Annualised W-2 salary (S-corp) ..........  $${f(result.detail.annualisedW2SCorp)}
Annualised W-2 wages (other) ............  $${f(result.detail.annualisedW2Other)}
Other projected income ..................  $${f(result.detail.otherProjectedIncome)}
Taxable income after QBI ................  $${f(result.detail.taxableIncomeAfterQBI)}
QBI deduction ...........................  $${f(result.detail.qbiDeduction)}
Ordinary income tax .....................  $${f(result.detail.ordinaryIncomeTax)}
Self-employment tax .....................  $${f(result.detail.selfEmploymentTax)}
Projected 2025 withholding .............. –$${f(result.detail.projectedWithholding)}
================================================`
  );
}

module.exports = { calculateTaxEstimate, formatTaxEstimate };
