/* ========= STATE RATES & STANDARD DEDUCTIONS ========= */
const STATE_DATA = {
  AL:{rate:{under:.02,   over:.05  }, SD:{MFJ:8000,  HOH:4000,  S:4000,  MFS:4000}},
  AK:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  AZ:{rate:{under:.023,  over:.026 }, SD:{MFJ:25600, HOH:19400, S:12800, MFS:12800}},
  AR:{rate:{under:.02,   over:.049 }, SD:{MFJ:4400,  HOH:2200,  S:2200,  MFS:2200}},
  CA:{rate:{under:.01,   over:.133 }, SD:{MFJ:9600,  HOH:7200,  S:4800,  MFS:4800}},
  CO:{rate:{under:.044,  over:.044 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  CT:{rate:{under:.03,   over:.0699}, SD:{MFJ:24000, HOH:18000, S:15000, MFS:12000}},
  DE:{rate:{under:.022,  over:.066 }, SD:{MFJ:6500,  HOH:3250,  S:3250,  MFS:3250}},
  DC:{rate:{under:.045,  over:.109 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  FL:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  GA:{rate:{under:.01,   over:.0575}, SD:{MFJ:5400,  HOH:4000,  S:2700,  MFS:2700}},
  HI:{rate:{under:.014,  over:.11  }, SD:{MFJ:4000,  HOH:2920,  S:2200,  MFS:2000}},
  ID:{rate:{under:.055,  over:.055 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  IL:{rate:{under:.0495, over:.0495}, SD:{MFJ:2710,  HOH:2000,  S:2000,  MFS:1355}},
  IN:{rate:{under:.0315, over:.0315}, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  IA:{rate:{under:.044,  over:.058 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  KS:{rate:{under:.031,  over:.057 }, SD:{MFJ:8000,  HOH:6000,  S:4000,  MFS:4000}},
  KY:{rate:{under:.045,  over:.045 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  LA:{rate:{under:.0185, over:.0475}, SD:{MFJ:9000,  HOH:4500,  S:4500,  MFS:4500}},
  ME:{rate:{under:.058,  over:.0715}, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MD:{rate:{under:.0225, over:.0575}, SD:{MFJ:2600,  HOH:1900,  S:1300,  MFS:1300}},
  MA:{rate:{under:.05,   over:.09  }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MI:{rate:{under:.0425, over:.0425}, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MN:{rate:{under:.0535, over:.0985}, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MS:{rate:{under:0,     over:.05  }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MO:{rate:{under:0,     over:.045 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  MT:{rate:{under:.043,  over:.05  }, SD:{MFJ:4800,  HOH:3600,  S:2400,  MFS:2400}},
  NE:{rate:{under:.0246, over:.0684}, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  NV:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  NH:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  NJ:{rate:{under:.014,  over:.1075},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  NM:{rate:{under:.017,  over:.059 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  NY:{rate:{under:.0585, over:.0882},SD:{MFJ:16050, HOH:8000,  S:8000,  MFS:8000}},
  NC:{rate:{under:.045,  over:.045 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  ND:{rate:{under:.014,  over:.0229},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  OH:{rate:{under:.0275, over:.0351},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  OK:{rate:{under:.005,  over:.045 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  OR:{rate:{under:.0475, over:.099 }, SD:{MFJ:5850,  HOH:2925, S:2925,  MFS:5850}},
  PA:{rate:{under:.0307, over:.0307},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  RI:{rate:{under:.0375, over:.0599},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  SC:{rate:{under:0,     over:.069 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  SD:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  TN:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  TX:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  UT:{rate:{under:.0445, over:.0445},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  VT:{rate:{under:.0335, over:.0875},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  VA:{rate:{under:.02,   over:.0575},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  WA:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  WV:{rate:{under:.03,   over:.065 }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  WI:{rate:{under:.0325, over:.0765},SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}},
  WY:{rate:{under:0,     over:0    }, SD:{MFJ:0,     HOH:0,     S:0,     MFS:0}}
};

/* ========= NAME ↔ ABBR MAP ========= */
const NAME_TO_ABBR = {
  "Alabama":"AL","AL":"AL","Alaska":"AK","AK":"AK","Arizona":"AZ","AZ":"AZ",
  "Arkansas":"AR","AR":"AR","California":"CA","CA":"CA","Colorado":"CO","CO":"CO",
  "Connecticut":"CT","CT":"CT","Delaware":"DE","DE":"DE",
  "District Of Columbia":"DC","District of Columbia":"DC","DC":"DC",
  "Florida":"FL","FL":"FL","Georgia":"GA","GA":"GA","Hawaii":"HI","HI":"HI",
  "Idaho":"ID","ID":"ID","Illinois":"IL","IL":"IL","Indiana":"IN","IN":"IN",
  "Iowa":"IA","IA":"IA","Kansas":"KS","KS":"KS","Kentucky":"KY","KY":"KY",
  "Louisiana":"LA","LA":"LA","Maine":"ME","ME":"ME","Maryland":"MD","MD":"MD",
  "Massachusetts":"MA","MA":"MA","Michigan":"MI","MI":"MI","Minnesota":"MN","MN":"MN",
  "Mississippi":"MS","MS":"MS","Missouri":"MO","MO":"MO","Montana":"MT","MT":"MT",
  "Nebraska":"NE","NE":"NE","Nevada":"NV","NV":"NV","New Hampshire":"NH","NH":"NH",
  "New Jersey":"NJ","NJ":"NJ","New Mexico":"NM","NM":"NM","New York":"NY","NY":"NY",
  "North Carolina":"NC","NC":"NC","North Dakota":"ND","ND":"ND","Ohio":"OH","OH":"OH",
  "Oklahoma":"OK","OK":"OK","Oregon":"OR","OR":"OR","Pennsylvania":"PA","PA":"PA",
  "Rhode Island":"RI","RI":"RI","South Carolina":"SC","SC":"SC",
  "South Dakota":"SD","SD":"SD","Tennessee":"TN","TN":"TN","Texas":"TX","TX":"TX",
  "Utah":"UT","UT":"UT","Vermont":"VT","VT":"VT","Virginia":"VA","VA":"VA",
  "Washington":"WA","WA":"WA","West Virginia":"WV","WV":"WV","Wisconsin":"WI","WI":"WI",
  "Wyoming":"WY","WY":"WY"
};

/* ========= PERIOD (same as federal tool) ========= */
const PERIOD = {
  Q1:{months:3, elapsed:3},  Q2:{months:2, elapsed:5},
  Q3:{months:3, elapsed:8},  Q4:{months:4, elapsed:12}
};

/* ========= STATUS MAP ========= */
const statusMap = {
  'single': 'S',
  's': 'S',
  'married filing jointly (most common)': 'MFJ',
  'mfj': 'MFJ',
  'head of household': 'HOH',
  'hoh': 'HOH',
  'married filing separately (rare)': 'MFS',
  'mfs': 'MFS'
};

/* ========= HELPERS ========= */
const f = n => Math.ceil(n).toLocaleString();
const p = n => n === null ? "—" : n.toFixed(1) + " %";

function calculateStateTaxes({
  state, status, quarter, qGross, qExp, w2SCorpYTD, w2OtherYTD, withYTD, otherInc
}) {
  // Map state name/abbr
  const abbr = NAME_TO_ABBR[String(state).trim()] || NAME_TO_ABBR[String(state).trim().toUpperCase()];
  if (!abbr || !STATE_DATA[abbr]) {
    throw new Error("Unknown state name or abbreviation.");
  }
  // Map status
  let statusInput = String(status).trim().toLowerCase();
  const mappedStatus = statusMap[statusInput];
  if (!mappedStatus) {
    throw new Error("Invalid status value. Accepted values are: 'Single', 'Married Filing Jointly (Most Common)', 'Head Of Household', 'Married Filing Separately (Rare)', 'S', 'MFJ', 'HOH', 'MFS'.");
  }
  const { rate, SD } = STATE_DATA[abbr];
  const monthsQ  = PERIOD[quarter].months;
  const monthsEL = PERIOD[quarter].elapsed;
  const qProfit = Math.max(qGross - qExp, 0);
  const annProfitGross = qProfit * (12 / monthsQ);
  const annW2SCorp = w2SCorpYTD * (12 / monthsEL);
  const annW2Other = w2OtherYTD * (12 / monthsEL);
  const annProfitNet = Math.max(annProfitGross - annW2SCorp, 0);
  const seBase = annProfitNet * 0.9235;
  const ssCapLeft = 176_100 - (annW2SCorp + annW2Other);
  const seTaxTmp = Math.min(seBase, Math.max(ssCapLeft, 0)) * 0.124
                 + seBase * 0.029
                 + (seBase > 200000 ? (seBase - 200000) * 0.009 : 0);
  const halfSE = seTaxTmp / 2;
  const preSD = Math.max(annProfitNet + annW2SCorp + annW2Other + otherInc - halfSE, 0);
  const taxable = Math.max(preSD - SD[mappedStatus], 0);
  const useRate = taxable <= 150000 ? rate.under : rate.over;
  const incTax = taxable * useRate;
  const projWith = withYTD * (12 / monthsEL);
  const grossTax = incTax;
  const netTax = Math.max(grossTax - projWith, 0);
  const qFactor = 12 / monthsQ;
  const payment = Math.ceil(netTax / qFactor / 10) * 10;
  const effRate = taxable > 0 ? (grossTax / preSD) * 100 : null;
  // Helper to round to 2 decimals
  const r2 = v => Number(v.toFixed(2));
  return {
    state: abbr,
    quarter,
    amountToPay: r2(payment),
    projectedStateTax: r2(grossTax),
    effectiveTaxRate: effRate === null ? null : r2(effRate),
    detail: {
      quarterBusinessProfit: r2(qProfit),
      annualisedBusinessProfitNet: r2(annProfitNet),
      annualisedW2SCorp: r2(annW2SCorp),
      annualisedW2Other: r2(annW2Other),
      otherProjectedIncome: r2(otherInc),
      stateTaxableIncome: r2(taxable),
      stateStandardDeduction: r2(SD[mappedStatus]),
      appliedFlatRate: r2(useRate * 100),
      projectedWithholding: r2(projWith)
    }
  };
}

function formatStateTaxEstimate(result) {
  const stateFull = Object.keys(NAME_TO_ABBR).find(k => NAME_TO_ABBR[k] === result.state && k.length > 2) || result.state;
  const f = n => Math.ceil(n).toLocaleString();
  const p = n => n === null ? "—" : n.toFixed(1) + " %";
  return (
`==============  ${result.quarter} ${stateFull.toUpperCase()} ESTIMATE  ==============

Amount to pay this quarter .............  $${f(result.amountToPay)}
Projected 2025 ${stateFull} tax (all year)  $${f(result.projectedStateTax)}
Effective state rate (proj) .............  ${p(result.effectiveTaxRate)}

---------------  DETAIL  -----------------
Quarter business profit .................  $${f(result.detail.quarterBusinessProfit)}
Annualised business profit (net) ........  $${f(result.detail.annualisedBusinessProfitNet)}
Annualised W-2 salary (S-corp) ..........  $${f(result.detail.annualisedW2SCorp)}
Annualised W-2 wages (other) ............  $${f(result.detail.annualisedW2Other)}
Other projected income ..................  $${f(result.detail.otherProjectedIncome)}
State-taxable income ....................  $${f(result.detail.stateTaxableIncome)}
State standard deduction applied ........  $${f(result.detail.stateStandardDeduction)}
Applied flat rate .......................  ${result.detail.appliedFlatRate.toFixed(2)} %
Projected 2025 withholding ..............  –$${f(result.detail.projectedWithholding)}
===========================================================`
  );
}

module.exports = { calculateStateTaxes, formatStateTaxEstimate }; 