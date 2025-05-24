/* =====================================================================
   2025 STATE QUARTERLY-TAX ESTIMATOR  –  Y-T-D VERSION  (23 May 2025)
   • Accepts year-to-date gross income & expenses (grossYTD / expYTD)
   • Adds cumulative "Target paid through …" and "Tax liability through …"
   • Otherwise identical logic to the original quarter-based tool
   ===================================================================== */

/* ---------- 1.  MASTER DATA  (brackets + standard-deductions) -------- */
const STATE_DATA = {

    /* ---------- Alabama (AL) ---------- */
    AL:{brackets:{
          S:[[  500,0.02],[ 3000,0.04],[Infinity,0.05]],
          HOH:[[  500,0.02],[ 3000,0.04],[Infinity,0.05]],
          MFS:[[  500,0.02],[ 3000,0.04],[Infinity,0.05]],
          MFJ:[[ 1000,0.02],[ 6000,0.04],[Infinity,0.05]]
        },
        SD:{MFJ:8000,HOH:4000,S:4000,MFS:4000}},
    
    /* ---------- Alaska (AK) ---------- */
    AK:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Arizona (AZ) ---------- */
    AZ:{brackets:{MFJ:[[Infinity,0.025]],HOH:[[Infinity,0.025]],
                  S:[[Infinity,0.025]],MFS:[[Infinity,0.025]]},
        SD:{MFJ:25600,HOH:19400,S:12800,MFS:12800}},
    
    /* ---------- Arkansas (AR) ---------- */
    AR:{brackets:{MFJ:[[ 4500,0.02],[Infinity,0.039]],HOH:[[ 4500,0.02],[Infinity,0.039]],
                  S:[[ 4500,0.02],[Infinity,0.039]],MFS:[[ 4500,0.02],[Infinity,0.039]]},
        SD:{MFJ:4400,HOH:2200,S:2200,MFS:2200}},
    
    /* ---------- California (CA) ---------- */
    CA:{brackets:{
          S:[[ 10756,0.01],[ 25499,0.02],[ 40245,0.04],[ 55866,0.06],[ 70606,0.08],
            [360659,0.093],[432787,0.103],[721314,0.113],[Infinity,0.123]],
          MFS:[[ 10756,0.01],[ 25499,0.02],[ 40245,0.04],[ 55866,0.06],[ 70606,0.08],
               [360659,0.093],[432787,0.103],[721314,0.113],[Infinity,0.123]],
          MFJ:[[ 21512,0.01],[ 50998,0.02],[ 80490,0.04],[111732,0.06],[141732,0.08],
               [721318,0.093],[865574,0.103],[1442628,0.113],[Infinity,0.123]],
          HOH:[[ 21527,0.01],[ 51000,0.02],[ 65744,0.04],[ 81364,0.06],[ 96107,0.08],
               [490493,0.093],[588593,0.103],[980987,0.113],[Infinity,0.123]]
        },
        SD:{MFJ:9600,HOH:7200,S:4800,MFS:4800}},
    
    /* ---------- Colorado (CO) ---------- */
    CO:{brackets:{MFJ:[[Infinity,0.044]],HOH:[[Infinity,0.044]],
                  S:[[Infinity,0.044]],MFS:[[Infinity,0.044]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Connecticut (CT) ---------- */
    CT:{brackets:{
          S:[[ 10000,0.02],[ 50000,0.045],[100000,0.055],[200000,0.06],
            [250000,0.065],[500000,0.069],[Infinity,0.0699]],
          MFS:[[ 10000,0.02],[ 50000,0.045],[100000,0.055],[200000,0.06],
               [250000,0.065],[500000,0.069],[Infinity,0.0699]],
          HOH:[[ 16000,0.02],[ 80000,0.045],[160000,0.055],[320000,0.06],
               [400000,0.065],[800000,0.069],[Infinity,0.0699]],
          MFJ:[[ 20000,0.02],[100000,0.045],[200000,0.055],[400000,0.06],
               [500000,0.065],[1000000,0.069],[Infinity,0.0699]]
        },
        SD:{MFJ:24000,HOH:18000,S:15000,MFS:12000}},
    
    /* ---------- Delaware (DE) ---------- */
    DE:{brackets:{
          MFJ:[[  2000,0],[  5000,0.022],[ 10000,0.039],[ 20000,0.048],
               [ 25000,0.052],[ 60000,0.0555],[Infinity,0.066]],
          HOH:[[  2000,0],[  5000,0.022],[ 10000,0.039],[ 20000,0.048],
               [ 25000,0.052],[ 60000,0.0555],[Infinity,0.066]],
          S:[[  2000,0],[  5000,0.022],[ 10000,0.039],[ 20000,0.048],
             [ 25000,0.052],[ 60000,0.0555],[Infinity,0.066]],
          MFS:[[  2000,0],[  5000,0.022],[ 10000,0.039],[ 20000,0.048],
               [ 25000,0.052],[ 60000,0.0555],[Infinity,0.066]]
        },
        SD:{MFJ:6500,HOH:3250,S:3250,MFS:3250}},
    
    /* ---------- District of Columbia (DC) ---------- */
    DC:{brackets:{
          MFJ:[[ 10000,0.04],[ 40000,0.06],[ 60000,0.065],[250000,0.085],
               [500000,0.0925],[1000000,0.0975],[Infinity,0.1075]],
          HOH:[[ 10000,0.04],[ 40000,0.06],[ 60000,0.065],[250000,0.085],
               [500000,0.0925],[1000000,0.0975],[Infinity,0.1075]],
          S:[[ 10000,0.04],[ 40000,0.06],[ 60000,0.065],[250000,0.085],
             [500000,0.0925],[1000000,0.0975],[Infinity,0.1075]],
          MFS:[[ 10000,0.04],[ 40000,0.06],[ 60000,0.065],[250000,0.085],
               [500000,0.0925],[1000000,0.0975],[Infinity,0.1075]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Florida (FL) ---------- */
    FL:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Georgia (GA) ---------- */
    GA:{brackets:{MFJ:[[Infinity,0.0539]],HOH:[[Infinity,0.0539]],
                  S:[[Infinity,0.0539]],MFS:[[Infinity,0.0539]]},
        SD:{MFJ:5400,HOH:4000,S:2700,MFS:2700}},
    
    /* ---------- Hawaii (HI) ---------- */
    HI:{brackets:{
          S:[[  9600,0.014],[ 14400,0.032],[ 19200,0.055],[ 24000,0.064],[ 36000,0.068],
            [ 48000,0.072],[125000,0.076],[175000,0.079],[225000,0.0825],
            [275000,0.09],[325000,0.10],[Infinity,0.11]],
          MFS:[[  9600,0.014],[ 14400,0.032],[ 19200,0.055],[ 24000,0.064],[ 36000,0.068],
               [ 48000,0.072],[125000,0.076],[175000,0.079],[225000,0.0825],
               [275000,0.09],[325000,0.10],[Infinity,0.11]],
          MFJ:[[ 19200,0.014],[ 28800,0.032],[ 38400,0.055],[ 48000,0.064],[ 72000,0.068],
               [ 96000,0.072],[250000,0.076],[350000,0.079],[450000,0.0825],
               [550000,0.09],[650000,0.10],[Infinity,0.11]],
          HOH:[[  9600,0.014],[ 14400,0.032],[ 19200,0.055],[ 24000,0.064],[ 36000,0.068],
               [ 48000,0.072],[125000,0.076],[175000,0.079],[225000,0.0825],
               [275000,0.09],[325000,0.10],[Infinity,0.11]]
        },
        SD:{MFJ:4000,HOH:2920,S:2200,MFS:2000}},
    
    /* ---------- Idaho (ID) ---------- */
    ID:{brackets:{MFJ:[[Infinity,0.05695]],HOH:[[Infinity,0.05695]],
                  S:[[Infinity,0.05695]],MFS:[[Infinity,0.05695]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Illinois (IL) ---------- */
    IL:{brackets:{MFJ:[[Infinity,0.0495]],HOH:[[Infinity,0.0495]],
                  S:[[Infinity,0.0495]],MFS:[[Infinity,0.0495]]},
        SD:{MFJ:2710,HOH:2000,S:2000,MFS:1355}},
    
    /* ---------- Indiana (IN) ---------- */
    IN:{brackets:{MFJ:[[Infinity,0.03]],HOH:[[Infinity,0.03]],
                  S:[[Infinity,0.03]],MFS:[[Infinity,0.03]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Iowa (IA) ---------- */
    IA:{brackets:{MFJ:[[Infinity,0.038]],HOH:[[Infinity,0.038]],
                  S:[[Infinity,0.038]],MFS:[[Infinity,0.038]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Kansas (KS) ---------- */
    KS:{brackets:{
          S:[[23000,0.052],[Infinity,0.0558]],
          HOH:[[23000,0.052],[Infinity,0.0558]],
          MFS:[[23000,0.052],[Infinity,0.0558]],
          MFJ:[[46000,0.052],[Infinity,0.0558]]
        },
        SD:{MFJ:8000,HOH:6000,S:4000,MFS:4000}},
    
    /* ---------- Kentucky (KY) ---------- */
    KY:{brackets:{MFJ:[[Infinity,0.04]],HOH:[[Infinity,0.04]],
                  S:[[Infinity,0.04]],MFS:[[Infinity,0.04]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Louisiana (LA) ---------- */
    LA:{brackets:{MFJ:[[Infinity,0.03]],HOH:[[Infinity,0.03]],
                  S:[[Infinity,0.03]],MFS:[[Infinity,0.03]]},
        SD:{MFJ:9000,HOH:4500,S:4500,MFS:4500}},
    
    /* ---------- Maine (ME) ---------- */
    ME:{brackets:{
          S:[[26800,0.058],[63450,0.0675],[Infinity,0.0715]],
          MFS:[[26800,0.058],[63450,0.0675],[Infinity,0.0715]],
          HOH:[[40200,0.058],[95150,0.0675],[Infinity,0.0715]],
          MFJ:[[53600,0.058],[126900,0.0675],[Infinity,0.0715]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Maryland (MD) ---------- */
    MD:{brackets:{
          S:[[ 1000,0.02],[ 2000,0.03],[ 3000,0.04],[100000,0.0475],
            [125000,0.05],[150000,0.0525],[250000,0.055],[Infinity,0.0575]],
          MFS:[[ 1000,0.02],[ 2000,0.03],[ 3000,0.04],[100000,0.0475],
               [125000,0.05],[150000,0.0525],[250000,0.055],[Infinity,0.0575]],
          MFJ:[[ 1000,0.02],[ 2000,0.03],[ 3000,0.04],[150000,0.0475],
               [175000,0.05],[225000,0.0525],[300000,0.055],[Infinity,0.0575]],
          HOH:[[ 1000,0.02],[ 2000,0.03],[ 3000,0.04],[150000,0.0475],
               [175000,0.05],[225000,0.0525],[300000,0.055],[Infinity,0.0575]]
        },
        SD:{MFJ:2600,HOH:1900,S:1300,MFS:1300}},
    
    /* ---------- Massachusetts (MA) ---------- */
    MA:{brackets:{MFJ:[[Infinity,0.05]],HOH:[[Infinity,0.05]],
                  S:[[Infinity,0.05]],MFS:[[Infinity,0.05]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Michigan (MI) ---------- */
    MI:{brackets:{MFJ:[[Infinity,0.0425]],HOH:[[Infinity,0.0425]],
                  S:[[Infinity,0.0425]],MFS:[[Infinity,0.0425]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Minnesota (MN) ---------- */
    MN:{brackets:{
          S:[[ 32570,0.0535],[106990,0.068],[198630,0.0785],[Infinity,0.0985]],
          MFS:[[23810,0.0535],[94590,0.068],[165205,0.0785],[Infinity,0.0985]],
          MFJ:[[47620,0.0535],[189180,0.068],[330410,0.0785],[Infinity,0.0985]],
          HOH:[[40100,0.0535],[161130,0.068],[264050,0.0785],[Infinity,0.0985]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Mississippi (MS) ---------- */
    MS:{brackets:{MFJ:[[Infinity,0.044]],HOH:[[Infinity,0.044]],
                  S:[[Infinity,0.044]],MFS:[[Infinity,0.044]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Missouri (MO) ---------- */
    MO:{brackets:{
          MFJ:[[ 1313,0],[ 2626,0.02],[ 3939,0.025],[ 5252,0.03],
               [ 6565,0.035],[ 7878,0.04],[ 9191,0.045],[Infinity,0.047]],
          HOH:[[ 1313,0],[ 2626,0.02],[ 3939,0.025],[ 5252,0.03],
               [ 6565,0.035],[ 7878,0.04],[ 9191,0.045],[Infinity,0.047]],
          S:[[ 1313,0],[ 2626,0.02],[ 3939,0.025],[ 5252,0.03],
             [ 6565,0.035],[ 7878,0.04],[ 9191,0.045],[Infinity,0.047]],
          MFS:[[ 1313,0],[ 2626,0.02],[ 3939,0.025],[ 5252,0.03],
               [ 6565,0.035],[ 7878,0.04],[ 9191,0.045],[Infinity,0.047]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Montana (MT) ---------- */
    MT:{brackets:{
          S:[[21100,0.047],[Infinity,0.059]],
          MFS:[[21100,0.047],[Infinity,0.059]],
          MFJ:[[42200,0.047],[Infinity,0.059]],
          HOH:[[31700,0.047],[Infinity,0.059]]
        },
        SD:{MFJ:4800,HOH:3600,S:2400,MFS:2400}},
    
    /* ---------- Nebraska (NE) ---------- */
    NE:{brackets:{
          S:[[ 4030,0.0246],[24120,0.0351],[38870,0.0501],[Infinity,0.052]],
          MFS:[[ 4030,0.0246],[24120,0.0351],[38870,0.0501],[Infinity,0.052]],
          MFJ:[[ 8040,0.0246],[48250,0.0351],[77730,0.0501],[Infinity,0.052]],
          HOH:[[ 4030,0.0246],[24120,0.0351],[38870,0.0501],[Infinity,0.052]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Nevada (NV) ---------- */
    NV:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- New Hampshire (NH) ---------- */
    NH:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- New Jersey (NJ) ---------- */
    NJ:{brackets:{
          S:[[ 20000,0.014],[ 35000,0.0175],[ 40000,0.035],[ 75000,0.0553],
            [500000,0.0637],[1000000,0.0897],[Infinity,0.1075]],
          MFS:[[ 20000,0.014],[ 35000,0.0175],[ 40000,0.035],[ 75000,0.0553],
               [500000,0.0637],[1000000,0.0897],[Infinity,0.1075]],
          MFJ:[[ 20000,0.014],[ 50000,0.0175],[ 70000,0.0245],[ 80000,0.035],
               [150000,0.0553],[ 500000,0.0637],[1000000,0.0897],[Infinity,0.1075]],
          HOH:[[ 20000,0.014],[ 35000,0.0175],[ 40000,0.035],[ 75000,0.0553],
               [500000,0.0637],[1000000,0.0897],[Infinity,0.1075]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- New Mexico (NM) ---------- */
    NM:{brackets:{
          S:[[  5500,0.015],[ 16500,0.032],[ 33500,0.043],[ 66500,0.047],
            [210000,0.049],[Infinity,0.059]],
          MFS:[[  5500,0.015],[ 16500,0.032],[ 33500,0.043],[ 66500,0.047],
               [210000,0.049],[Infinity,0.059]],
          MFJ:[[  8000,0.015],[ 25000,0.032],[ 50000,0.043],[100000,0.047],
               [315000,0.049],[Infinity,0.059]],
          HOH:[[  5500,0.015],[ 16500,0.032],[ 33500,0.043],[ 66500,0.047],
               [210000,0.049],[Infinity,0.059]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- New York (NY) ---------- */
    NY:{brackets:{
          S:[[   8500,0.04],[  11700,0.045],[  13900,0.0525],[  80650,0.055],
            [ 215400,0.06],[1077550,0.0685],[5000000,0.0965],
            [25000000,0.103],[Infinity,0.109]],
          MFS:[[   8500,0.04],[  11700,0.045],[  13900,0.0525],[  80650,0.055],
               [ 215400,0.06],[1077550,0.0685],[5000000,0.0965],
               [25000000,0.103],[Infinity,0.109]],
          MFJ:[[  17150,0.04],[  23600,0.045],[  27900,0.0525],[ 161550,0.055],
               [ 323200,0.06],[2155350,0.0685],[5000000,0.0965],
               [25000000,0.103],[Infinity,0.109]],
          HOH:[[   8500,0.04],[  11700,0.045],[  13900,0.0525],[  80650,0.055],
               [ 215400,0.06],[1077550,0.0685],[5000000,0.0965],
               [25000000,0.103],[Infinity,0.109]]
        },
        SD:{MFJ:16050,HOH:8000,S:8000,MFS:8000}},
    
    /* ---------- North Carolina (NC) ---------- */
    NC:{brackets:{MFJ:[[Infinity,0.0425]],HOH:[[Infinity,0.0425]],
                  S:[[Infinity,0.0425]],MFS:[[Infinity,0.0425]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- North Dakota (ND) ---------- */
    ND:{brackets:{
          S:[[ 48475,0],[244825,0.0195],[Infinity,0.025]],
          MFS:[[ 48475,0],[244825,0.0195],[Infinity,0.025]],
          MFJ:[[ 80975,0],[298075,0.0195],[Infinity,0.025]],
          HOH:[[ 48475,0],[244825,0.0195],[Infinity,0.025]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Ohio (OH) ---------- */
    OH:{brackets:{
          MFJ:[[ 26050,0],[100000,0.0275],[Infinity,0.035]],
          HOH:[[ 26050,0],[100000,0.0275],[Infinity,0.035]],
          S:[[ 26050,0],[100000,0.0275],[Infinity,0.035]],
          MFS:[[ 26050,0],[100000,0.0275],[Infinity,0.035]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Oklahoma (OK) ---------- */
    OK:{brackets:{
          S:[[ 1000,0.0025],[ 2500,0.0075],[ 3750,0.0175],[ 4900,0.0275],
            [ 7200,0.0375],[Infinity,0.0475]],
          MFS:[[ 1000,0.0025],[ 2500,0.0075],[ 3750,0.0175],[ 4900,0.0275],
               [ 7200,0.0375],[Infinity,0.0475]],
          MFJ:[[ 2000,0.0025],[ 5000,0.0075],[ 7500,0.0175],[ 9800,0.0275],
               [14400,0.0375],[Infinity,0.0475]],
          HOH:[[ 1000,0.0025],[ 2500,0.0075],[ 3750,0.0175],[ 4900,0.0275],
               [ 7200,0.0375],[Infinity,0.0475]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Oregon (OR) ---------- */
    OR:{brackets:{
          S:[[  4400,0.0475],[ 11050,0.0675],[125000,0.0875],[Infinity,0.099]],
          MFS:[[  4400,0.0475],[ 11050,0.0675],[125000,0.0875],[Infinity,0.099]],
          MFJ:[[  8800,0.0475],[ 22100,0.0675],[250000,0.0875],[Infinity,0.099]],
          HOH:[[  8800,0.0475],[ 22100,0.0675],[250000,0.0875],[Infinity,0.099]]
        },
        SD:{MFJ:5850,HOH:2925,S:2925,MFS:5850}},
    
    /* ---------- Pennsylvania (PA) ---------- */
    PA:{brackets:{MFJ:[[Infinity,0.0307]],HOH:[[Infinity,0.0307]],
                  S:[[Infinity,0.0307]],MFS:[[Infinity,0.0307]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Rhode Island (RI) ---------- */
    RI:{brackets:{
          MFJ:[[ 79900,0.0375],[181650,0.0475],[Infinity,0.0599]],
          HOH:[[ 79900,0.0375],[181650,0.0475],[Infinity,0.0599]],
          S:[[ 79900,0.0375],[181650,0.0475],[Infinity,0.0599]],
          MFS:[[ 79900,0.0375],[181650,0.0475],[Infinity,0.0599]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- South Carolina (SC) ---------- */
    SC:{brackets:{
          MFJ:[[ 3560,0],[17830,0.03],[Infinity,0.062]],
          HOH:[[ 3560,0],[17830,0.03],[Infinity,0.062]],
          S:[[ 3560,0],[17830,0.03],[Infinity,0.062]],
          MFS:[[ 3560,0],[17830,0.03],[Infinity,0.062]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- South Dakota (SD) ---------- */
    SD:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Tennessee (TN) ---------- */
    TN:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Texas (TX) ---------- */
    TX:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Utah (UT) ---------- */
    UT:{brackets:{MFJ:[[Infinity,0.0455]],HOH:[[Infinity,0.0455]],
                  S:[[Infinity,0.0455]],MFS:[[Infinity,0.0455]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Vermont (VT) ---------- */
    VT:{brackets:{
          S:[[ 47900,0.0335],[116000,0.066],[242000,0.076],[Infinity,0.0875]],
          MFS:[[ 47900,0.0335],[116000,0.066],[242000,0.076],[Infinity,0.0875]],
          MFJ:[[ 79950,0.0335],[193300,0.066],[294600,0.076],[Infinity,0.0875]],
          HOH:[[ 47900,0.0335],[116000,0.066],[242000,0.076],[Infinity,0.0875]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Virginia (VA) ---------- */
    VA:{brackets:{
          MFJ:[[ 3000,0.02],[ 5000,0.03],[17000,0.05],[Infinity,0.0575]],
          HOH:[[ 3000,0.02],[ 5000,0.03],[17000,0.05],[Infinity,0.0575]],
          S:[[ 3000,0.02],[ 5000,0.03],[17000,0.05],[Infinity,0.0575]],
          MFS:[[ 3000,0.02],[ 5000,0.03],[17000,0.05],[Infinity,0.0575]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Washington (WA) ---------- */
    WA:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- West Virginia (WV) ---------- */
    WV:{brackets:{
          MFJ:[[ 10000,0.0222],[ 25000,0.0296],[ 40000,0.0333],
               [ 60000,0.0444],[Infinity,0.0482]],
          HOH:[[ 10000,0.0222],[ 25000,0.0296],[ 40000,0.0333],
               [ 60000,0.0444],[Infinity,0.0482]],
          S:[[ 10000,0.0222],[ 25000,0.0296],[ 40000,0.0333],
            [ 60000,0.0444],[Infinity,0.0482]],
          MFS:[[ 10000,0.0222],[ 25000,0.0296],[ 40000,0.0333],
               [ 60000,0.0444],[Infinity,0.0482]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Wisconsin (WI) ---------- */
    WI:{brackets:{
          S:[[ 14680,0.035],[ 29370,0.044],[323290,0.053],[Infinity,0.0765]],
          MFS:[[ 14680,0.035],[ 29370,0.044],[323290,0.053],[Infinity,0.0765]],
          MFJ:[[ 19580,0.035],[ 39150,0.044],[431060,0.053],[Infinity,0.0765]],
          HOH:[[ 14680,0.035],[ 29370,0.044],[323290,0.053],[Infinity,0.0765]]
        },
        SD:{MFJ:0,HOH:0,S:0,MFS:0}},
    
    /* ---------- Wyoming (WY) ---------- */
    WY:{brackets:{MFJ:[[Infinity,0]],HOH:[[Infinity,0]],
                  S:[[Infinity,0]],MFS:[[Infinity,0]]},
        SD:{MFJ:0,HOH:0,S:0,MFS:0}}
    
    }; /* ------------------- END STATE_DATA ------------------- */
    

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

function bracketTax(t, tbl) {
  let tax = 0, prev = 0, lines = [];
  for (const [edge, rate] of tbl) {
    if (t <= prev) break;
    const slice = Math.min(t, edge) - prev;
    const sliceTax = slice * rate;
    tax += sliceTax;
    lines.push({
      range: `$${f(prev)} – $${f(edge)}`,
      rate: (rate * 100).toFixed(2) + ' %',
      sliceTax: f(sliceTax)
    });
    prev = edge;
  }
  return { tax, lines };
}

function calculateStateTaxes({
  state, status, quarter, qGross, qExp, w2SCorpYTD, w2OtherYTD, withYTD, otherInc
}) {
  // Map state name/abbr
  const abbr = NAME_TO_ABBR[String(state).trim()] || NAME_TO_ABBR[String(state).trim().toUpperCase()];
  // Map status
  let statusInput = String(status).trim().toLowerCase();
  const mappedStatus = statusMap[statusInput] || status;
  const stateData = STATE_DATA[abbr];
  const { brackets: BR, SD } = stateData || {};

  // Debug logging
  console.log('abbr:', abbr);
  console.log('mappedStatus:', mappedStatus);
  console.log('BR:', BR);
  console.log('SD:', SD);

  // Defensive checks
  if (!abbr || !stateData) throw new Error(`Unknown state name or abbreviation: ${state}`);
  if (!BR || !SD) throw new Error(`State data missing for ${abbr}`);
  if (!BR[mappedStatus]) throw new Error(`No tax brackets for status ${mappedStatus} in state ${abbr}`);
  if (typeof SD[mappedStatus] === 'undefined') throw new Error(`No standard deduction for status ${mappedStatus} in state ${abbr}`);

  const stateFull = Object.keys(NAME_TO_ABBR)
                          .find(k => NAME_TO_ABBR[k]===abbr && k.length>2) || abbr;

  const monthsQ  = PERIOD[quarter].months;
  const monthsEL = PERIOD[quarter].elapsed;

  // Note: qGross and qExp are now YTD inputs, not quarterly
  const yGross = qGross;  // YTD 1099 gross
  const yExp   = qExp;    // YTD expenses

  /* ---- Annualise business profit ---- */
  const yProfit       = Math.max(yGross - yExp, 0);               // Y-T-D profit
  const annProfitG    = yProfit  * (12 / monthsEL);               // before salary adj.

  /* ---- Annualise W-2 wages ---- */
  const annW2SCorp = w2SCorpYTD * (12 / monthsEL);
  const annW2Other = w2OtherYTD * (12 / monthsEL);

  /* ---- Net business profit (remove S-corp salary) ---- */
  const annProfitNet = Math.max(annProfitG - annW2SCorp, 0);

  /* ---- Half of SE-tax deduction (rough, mirrors federal calc) ---- */
  const seBase    = annProfitNet * 0.9235;
  const ssCapLeft = 176_100 - (annW2SCorp + annW2Other);
  const seTaxTmp  = Math.min(seBase, Math.max(ssCapLeft,0))*0.124
                  + seBase * 0.029
                  + (seBase > 200000 ? (seBase - 200000)*0.009 : 0);
  const halfSE    = seTaxTmp / 2;

  /* ---- State-taxable income ---- */
  const preSD   = Math.max(annProfitNet + annW2SCorp + annW2Other + otherInc - halfSE, 0);
  const taxable = Math.max(preSD - SD[mappedStatus], 0);

  /* ---- Progressive-bracket tax ---- */
  const { tax, lines } = bracketTax(taxable, BR[mappedStatus]);

  /* ---- Withholding, quarterly payment, cumulative targets ---- */
  const projWith      = withYTD * (12 / monthsEL);
  const netTax        = Math.max(tax - projWith, 0);
  const qFactor       = 12 / monthsQ;                          // 4, 6, 4, 3
  const payment       = Math.ceil(netTax / qFactor / 10) * 10;

  const shouldHavePaid = Math.ceil(netTax * (monthsEL / 12) / 10) * 10;
  const partialTax     = Math.round(tax * (monthsEL / 12));

  /* ---- Stats for display ---- */
  const effRate  = preSD > 0 ? (tax / preSD) * 100 : null;
  const topRate  = BR[mappedStatus].find(([edge]) => taxable <= edge)?.[1]
                 || BR[mappedStatus][BR[mappedStatus].length-1][1];
  const labelToDt = { Q1:"Q1",
                      Q2:"Q1 + Q2",
                      Q3:"Q1 + Q2 + Q3",
                      Q4:"all 4 quarters" }[quarter];

  // Helper to round to 2 decimals
  const r2 = v => Number(v.toFixed(2));

  return {
    state: abbr,
    quarter,
    amountToPay: r2(payment),
    targetPaidThrough: r2(shouldHavePaid),
    projectedTaxLiabilityThrough: r2(partialTax),
    projectedStateTax: r2(Math.round(tax)),
    effectiveTaxRate: effRate === null ? null : r2(effRate),
    topMarginalRate: r2(topRate * 100),
    labelToDt: labelToDt,
    detail: {
      ytdBusinessProfit: r2(yProfit),
      annualisedBusinessProfitNet: r2(annProfitNet),
      annualisedW2SCorp: r2(annW2SCorp),
      annualisedW2Other: r2(annW2Other),
      otherProjectedIncome: r2(otherInc),
      stateTaxableIncome: r2(taxable),
      stateStandardDeduction: r2(SD[mappedStatus]),
      projectedWithholding: r2(projWith),
      bracketDetails: lines // array of {range, rate, sliceTax}
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
Target paid through ${result.labelToDt} ........  $${f(result.targetPaidThrough)}

Projected tax liability through ${result.labelToDt} ...  $${f(result.projectedTaxLiabilityThrough)}
Projected 2025 ${stateFull} tax (all year)  $${f(result.projectedStateTax)}
Effective state rate (proj) .............  ${p(result.effectiveTaxRate)}
Top marginal rate applied ...............  ${result.topMarginalRate.toFixed(2)} %

---------------  DETAIL  -----------------
YTD business profit .....................  $${f(result.detail.ytdBusinessProfit)}
Annualised business profit (net) ........  $${f(result.detail.annualisedBusinessProfitNet)}
Annualised W-2 salary (S-corp) ..........  $${f(result.detail.annualisedW2SCorp)}
Annualised W-2 wages (other) ............  $${f(result.detail.annualisedW2Other)}
Other projected income ..................  $${f(result.detail.otherProjectedIncome)}
State-taxable income ....................  $${f(result.detail.stateTaxableIncome)}
Standard deduction (${result.state}) ..........  $${f(result.detail.stateStandardDeduction)}
Projected 2025 withholding .............. –$${f(result.detail.projectedWithholding)}

----------- Bracket-by-Bracket detail ------------
${result.detail.bracketDetails.map(l => `${l.range}  @ ${l.rate}  →  $${l.sliceTax}`).join('\n')}
===========================================================`
  );
}

module.exports = { calculateStateTaxes, formatStateTaxEstimate }; 