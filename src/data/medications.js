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
