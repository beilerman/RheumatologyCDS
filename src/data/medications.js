export const MEDICATIONS = {
  ra: [
    {
      id: 'methotrexate',
      name: 'Methotrexate',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC with differential',
          frequency: 'Every 3 months initially, then every 3-6 months',
          notes: '',
        },
        {
          item: 'CMP (LFTs, renal function)',
          frequency: 'Every 3 months initially, then every 3-6 months',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Folic acid 1mg daily prescribed',
          frequency: 'Verify at each visit',
          notes: 'Reduces GI and hematologic side effects',
        },
        {
          item: 'Pregnancy test',
          frequency: 'Before starting and as needed',
          notes: 'Teratogenic',
        },
      ],
    },
    {
      id: 'leflunomide',
      name: 'Leflunomide',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'CMP (LFTs)',
          frequency: 'Monthly for first 6 months, then every 6-8 weeks',
          notes: '',
        },
        {
          item: 'Blood pressure',
          frequency: 'Each visit',
          notes: 'Can cause hypertension',
        },
        {
          item: 'Pregnancy status',
          frequency: 'Before starting',
          notes: 'Active metabolite persists — cholestyramine washout required',
        },
      ],
    },
    {
      id: 'hydroxychloroquine',
      name: 'Hydroxychloroquine',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'Baseline eye exam (retinal/OCT)',
          frequency: 'Within first year of use',
          notes: '',
        },
        {
          item: 'Annual eye exam',
          frequency: 'After 5 years of use (sooner with risk factors)',
          notes: 'Risk factors: renal impairment, tamoxifen use, macular disease',
        },
      ],
    },
    {
      id: 'sulfasalazine',
      name: 'Sulfasalazine',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC with differential',
          frequency: 'Every 2-4 weeks for first 3 months, then every 3 months',
          notes: '',
        },
        {
          item: 'CMP',
          frequency: 'Every 2-4 weeks for first 3 months, then every 3 months',
          notes: '',
        },
        {
          item: 'G6PD testing',
          frequency: 'Before starting in at-risk populations',
          notes: '',
        },
      ],
    },
    {
      id: 'adalimumab',
      name: 'Adalimumab',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: 'Contraindicated in moderate-severe HF',
        },
      ],
    },
    {
      id: 'etanercept',
      name: 'Etanercept',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'infliximab',
      name: 'Infliximab',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'certolizumab',
      name: 'Certolizumab',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'golimumab',
      name: 'Golimumab',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'tocilizumab',
      name: 'Tocilizumab',
      class: 'IL-6i',
      monitoring: [
        {
          item: 'CBC (neutrophils, platelets)',
          frequency: 'Every 4-8 weeks initially',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Every 4-8 weeks initially',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Monitor for GI perforation symptoms',
          frequency: 'Each visit',
          notes: 'Particularly in patients with diverticulitis history',
        },
      ],
    },
    {
      id: 'sarilumab',
      name: 'Sarilumab',
      class: 'IL-6i',
      monitoring: [
        {
          item: 'CBC (neutrophils, platelets)',
          frequency: 'Every 4-8 weeks initially',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Every 4-8 weeks initially',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Monitor for GI perforation symptoms',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'tofacitinib',
      name: 'Tofacitinib',
      class: 'JAKi',
      monitoring: [
        {
          item: 'CBC with differential and lymphocytes',
          frequency: 'Baseline, 4-8 weeks, then every 3 months',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'TB and viral hepatitis screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'VTE risk assessment',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'FDA boxed warning discussion',
          frequency: 'Before starting',
          notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death',
        },
      ],
    },
    {
      id: 'baricitinib',
      name: 'Baricitinib',
      class: 'JAKi',
      monitoring: [
        {
          item: 'CBC with differential and lymphocytes',
          frequency: 'Baseline, 4-8 weeks, then every 3 months',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'TB and viral hepatitis screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'VTE risk assessment',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'FDA boxed warning discussion',
          frequency: 'Before starting',
          notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death',
        },
      ],
    },
    {
      id: 'upadacitinib',
      name: 'Upadacitinib',
      class: 'JAKi',
      monitoring: [
        {
          item: 'CBC with differential and lymphocytes',
          frequency: 'Baseline, 4-8 weeks, then every 3 months',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'TB and viral hepatitis screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'VTE risk assessment',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'FDA boxed warning discussion',
          frequency: 'Before starting',
          notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death',
        },
      ],
    },
    {
      id: 'abatacept',
      name: 'Abatacept',
      class: 'T-cell co-stimulation modulator',
      monitoring: [
        {
          item: 'TB screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Periodically (no strict schedule)',
          notes: 'No routine labs required per guidelines but reasonable to check',
        },
      ],
    },
    {
      id: 'rituximab',
      name: 'Rituximab',
      class: 'B-cell depleting',
      monitoring: [
        {
          item: 'CBC',
          frequency: 'Before each cycle',
          notes: '',
        },
        {
          item: 'Quantitative immunoglobulins',
          frequency: 'Baseline and before each cycle',
          notes: 'Hypogammaglobulinemia increases infection risk',
        },
        {
          item: 'Hepatitis B screening',
          frequency: 'Before starting',
          notes: 'Can reactivate HBV — fatal cases reported',
        },
        {
          item: 'Monitor for infusion reactions',
          frequency: 'During and after infusion',
          notes: '',
        },
      ],
    },
    {
      id: 'prednisone',
      name: 'Prednisone',
      class: 'Glucocorticoid',
      monitoring: [
        {
          item: 'Blood glucose',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Blood pressure',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Bone density (DEXA)',
          frequency: 'If >3 months use',
          notes: '',
        },
        {
          item: 'Ophthalmology referral',
          frequency: 'If prolonged use',
          notes: 'Cataracts and glaucoma risk',
        },
        {
          item: 'Weight monitoring',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Document taper plan',
          frequency: 'Each visit',
          notes: 'Strongly recommend against long-term use',
        },
      ],
    },
  ],
  psa: [
    {
      id: 'psa-methotrexate',
      name: 'Methotrexate',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC with differential',
          frequency: 'Every 3 months initially, then every 3-6 months',
          notes: '',
        },
        {
          item: 'CMP (LFTs, renal function)',
          frequency: 'Every 3 months initially, then every 3-6 months',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Folic acid 1mg daily prescribed',
          frequency: 'Verify at each visit',
          notes: 'Reduces GI and hematologic side effects',
        },
      ],
    },
    {
      id: 'psa-leflunomide',
      name: 'Leflunomide',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'CMP (LFTs)',
          frequency: 'Monthly for first 6 months, then every 6-8 weeks',
          notes: '',
        },
        {
          item: 'Blood pressure',
          frequency: 'Each visit',
          notes: 'Can cause hypertension',
        },
      ],
    },
    {
      id: 'psa-sulfasalazine',
      name: 'Sulfasalazine',
      class: 'csDMARD',
      monitoring: [
        {
          item: 'CBC with differential',
          frequency: 'Every 2-4 weeks for first 3 months, then every 3 months',
          notes: '',
        },
        {
          item: 'CMP',
          frequency: 'Every 2-4 weeks for first 3 months, then every 3 months',
          notes: '',
        },
      ],
    },
    {
      id: 'psa-adalimumab',
      name: 'Adalimumab',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: 'Contraindicated in moderate-severe HF',
        },
      ],
    },
    {
      id: 'psa-etanercept',
      name: 'Etanercept',
      class: 'TNFi',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting and annually',
          notes: '',
        },
        {
          item: 'Hepatitis B/C screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'CBC, CMP',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'Monitor for infection signs',
          frequency: 'Each visit',
          notes: '',
        },
        {
          item: 'Heart failure screening',
          frequency: 'Each visit',
          notes: '',
        },
      ],
    },
    {
      id: 'psa-apremilast',
      name: 'Apremilast',
      class: 'PDE4i',
      monitoring: [
        {
          item: 'Weight',
          frequency: 'Each visit',
          notes: 'Weight loss reported; monitor in underweight patients',
        },
        {
          item: 'Depression and mood symptoms',
          frequency: 'Each visit',
          notes: 'New or worsening depression/suicidal ideation reported; assess at baseline',
        },
        {
          item: 'GI tolerance (nausea, diarrhea)',
          frequency: 'First 4 weeks, then as needed',
          notes: 'GI side effects typically improve after first month. Titration schedule helps tolerability.',
        },
      ],
    },
    {
      id: 'psa-secukinumab',
      name: 'Secukinumab',
      class: 'IL-17i',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Candidal infections',
          frequency: 'Each visit',
          notes: 'Mucocutaneous candidiasis risk increased; usually mild and responsive to treatment',
        },
        {
          item: 'IBD symptom screening',
          frequency: 'Each visit',
          notes: 'Can exacerbate or unmask Crohn\'s disease. Monitor for new GI symptoms.',
        },
      ],
    },
    {
      id: 'psa-ixekizumab',
      name: 'Ixekizumab',
      class: 'IL-17i',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Candidal infections',
          frequency: 'Each visit',
          notes: 'Mucocutaneous candidiasis risk increased',
        },
        {
          item: 'IBD symptom screening',
          frequency: 'Each visit',
          notes: 'Can exacerbate IBD. Contraindicated in active Crohn\'s disease.',
        },
      ],
    },
    {
      id: 'psa-ustekinumab',
      name: 'Ustekinumab',
      class: 'IL-12/23i',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Infection monitoring',
          frequency: 'Each visit',
          notes: 'Monitor for signs of infection; risk generally lower than TNFi',
        },
      ],
    },
    {
      id: 'psa-guselkumab',
      name: 'Guselkumab',
      class: 'IL-23i',
      monitoring: [
        {
          item: 'TB screening (PPD or IGRA)',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'Infection monitoring',
          frequency: 'Each visit',
          notes: 'Monitor for signs of serious infection',
        },
      ],
    },
    {
      id: 'psa-tofacitinib',
      name: 'Tofacitinib',
      class: 'JAKi',
      monitoring: [
        {
          item: 'CBC with differential and lymphocytes',
          frequency: 'Baseline, 4-8 weeks, then every 3 months',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'TB and viral hepatitis screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'VTE risk assessment',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'FDA boxed warning discussion',
          frequency: 'Before starting',
          notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death',
        },
      ],
    },
    {
      id: 'psa-upadacitinib',
      name: 'Upadacitinib',
      class: 'JAKi',
      monitoring: [
        {
          item: 'CBC with differential and lymphocytes',
          frequency: 'Baseline, 4-8 weeks, then every 3 months',
          notes: '',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'Lipid panel',
          frequency: 'Baseline and 4-8 weeks after starting',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Baseline then periodically',
          notes: '',
        },
        {
          item: 'TB and viral hepatitis screening',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'VTE risk assessment',
          frequency: 'Before starting',
          notes: '',
        },
        {
          item: 'FDA boxed warning discussion',
          frequency: 'Before starting',
          notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death',
        },
      ],
    },
  ],
  axspa: [
    {
      id: 'axspa-naproxen',
      name: 'Naproxen',
      class: 'NSAID',
      monitoring: [
        { item: 'Renal function (BUN/Cr)', frequency: 'Baseline, then periodically', notes: 'Avoid or use with caution in CKD' },
        { item: 'GI risk assessment', frequency: 'Each visit', notes: 'Consider PPI co-therapy in high-risk patients (age >65, prior GI bleed, anticoagulant use)' },
        { item: 'Cardiovascular risk assessment', frequency: 'Before starting and each visit', notes: 'NSAIDs increase CV risk; avoid in heart failure and post-MI' },
        { item: 'Blood pressure', frequency: 'Each visit', notes: 'NSAIDs can worsen hypertension' },
      ],
    },
    {
      id: 'axspa-celecoxib',
      name: 'Celecoxib',
      class: 'NSAID (COX-2 selective)',
      monitoring: [
        { item: 'Renal function (BUN/Cr)', frequency: 'Baseline, then periodically', notes: 'Avoid or use with caution in CKD' },
        { item: 'GI risk assessment', frequency: 'Each visit', notes: 'Lower GI risk than non-selective NSAIDs; may still require PPI in very high-risk patients' },
        { item: 'Cardiovascular risk assessment', frequency: 'Before starting and each visit', notes: 'COX-2 selective agents have CV risk; avoid in established CVD when possible' },
        { item: 'Blood pressure', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-indomethacin',
      name: 'Indomethacin',
      class: 'NSAID',
      monitoring: [
        { item: 'Renal function (BUN/Cr)', frequency: 'Baseline, then periodically', notes: 'Higher nephrotoxicity risk than other NSAIDs' },
        { item: 'GI risk assessment', frequency: 'Each visit', notes: 'Higher GI risk than other NSAIDs; PPI co-therapy strongly recommended' },
        { item: 'Cardiovascular risk assessment', frequency: 'Before starting and each visit', notes: '' },
        { item: 'CNS side effects (headache, dizziness)', frequency: 'Each visit', notes: 'Indomethacin has higher CNS side effect profile' },
        { item: 'Blood pressure', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-adalimumab',
      name: 'Adalimumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: 'Contraindicated in moderate-severe HF' },
      ],
    },
    {
      id: 'axspa-etanercept',
      name: 'Etanercept',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: 'Note: less effective for uveitis prevention than monoclonal anti-TNF antibodies' },
      ],
    },
    {
      id: 'axspa-infliximab',
      name: 'Infliximab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-certolizumab',
      name: 'Certolizumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: 'Preferred in pregnancy (Fc-free, minimal placental transfer)' },
      ],
    },
    {
      id: 'axspa-golimumab',
      name: 'Golimumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-secukinumab',
      name: 'Secukinumab',
      class: 'IL-17i',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting', notes: '' },
        { item: 'Candidal infections (oral, cutaneous)', frequency: 'Each visit', notes: 'Mucocutaneous candidiasis risk increased; usually mild and treatable' },
        { item: 'IBD symptom screening', frequency: 'Each visit', notes: 'Can exacerbate or unmask Crohn\'s disease. Caution if IBD history.' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-ixekizumab',
      name: 'Ixekizumab',
      class: 'IL-17i',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting', notes: '' },
        { item: 'Candidal infections', frequency: 'Each visit', notes: 'Mucocutaneous candidiasis risk increased' },
        { item: 'IBD symptom screening', frequency: 'Each visit', notes: 'Can exacerbate IBD. Contraindicated in active Crohn\'s disease.' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'axspa-tofacitinib',
      name: 'Tofacitinib',
      class: 'JAKi',
      monitoring: [
        { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
        { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Renal function', frequency: 'Baseline then periodically', notes: '' },
        { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
        { item: 'VTE risk assessment', frequency: 'Before starting', notes: '' },
        { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death' },
      ],
    },
    {
      id: 'axspa-upadacitinib',
      name: 'Upadacitinib',
      class: 'JAKi',
      monitoring: [
        { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
        { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Renal function', frequency: 'Baseline then periodically', notes: '' },
        { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
        { item: 'VTE risk assessment', frequency: 'Before starting', notes: '' },
        { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death' },
      ],
    },
    {
      id: 'axspa-sulfasalazine',
      name: 'Sulfasalazine',
      class: 'csDMARD (peripheral arthritis only)',
      monitoring: [
        { item: 'CBC with differential', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
        { item: 'CMP', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
        { item: 'Note: peripheral arthritis only', frequency: 'Prescribing reminder', notes: 'Sulfasalazine has NO efficacy for axial symptoms. Only use when peripheral joint arthritis is present alongside axial disease.' },
      ],
    },
  ],
  gout: [
    {
      id: 'allopurinol',
      name: 'Allopurinol',
      class: 'Xanthine oxidase inhibitor',
      monitoring: [
        {
          item: 'Serum urate',
          frequency: 'Every 2-5 weeks during titration, then every 6 months',
          notes: 'Target <6 mg/dL',
        },
        {
          item: 'Renal function',
          frequency: 'Annually',
          notes: '',
        },
        {
          item: 'HLA-B*5801 testing',
          frequency: 'Before starting',
          notes: 'Recommended in Southeast Asian and African American patients',
        },
      ],
    },
    {
      id: 'febuxostat',
      name: 'Febuxostat',
      class: 'Xanthine oxidase inhibitor',
      monitoring: [
        {
          item: 'Serum urate',
          frequency: 'During titration then every 6 months',
          notes: 'Target <6 mg/dL',
        },
        {
          item: 'LFTs',
          frequency: 'Baseline and periodically',
          notes: '',
        },
        {
          item: 'CV risk discussion',
          frequency: 'Before starting and each visit',
          notes: 'FDA boxed warning: increased CV death risk in patients with established CV disease',
        },
      ],
    },
    {
      id: 'colchicine',
      name: 'Colchicine',
      class: 'Anti-inflammatory',
      monitoring: [
        {
          item: 'CBC',
          frequency: 'If prolonged use',
          notes: '',
        },
        {
          item: 'Renal function',
          frequency: 'Periodically',
          notes: 'Dose adjust for CKD',
        },
        {
          item: 'Hepatic function',
          frequency: 'Periodically',
          notes: '',
        },
        {
          item: 'Drug interaction check',
          frequency: 'Each visit',
          notes: 'Clarithromycin, cyclosporine, statins increase myopathy risk',
        },
      ],
    },
    {
      id: 'probenecid',
      name: 'Probenecid',
      class: 'Uricosuric',
      monitoring: [
        {
          item: 'Renal function',
          frequency: 'Periodically',
          notes: 'Requires adequate renal function; avoid if urolithiasis',
        },
        {
          item: 'Drug interaction check',
          frequency: 'Each visit',
          notes: 'Affects excretion of many drugs',
        },
      ],
    },
  ],
};
