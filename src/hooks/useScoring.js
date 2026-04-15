import { useMemo } from 'react';
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
  calculateDAPSA,
  calculateBASDAI,
  calculateASDASCRP,
  calculateASDASSER,
  calculateFSQ,
} from '../utils/scoreCalculations.js';

export function useScoring(answers, condition) {
  return useMemo(() => {
    if (condition === 'ra') {
      return {
        cdai: calculateCDAI({
          sjc28: answers['ra-sjc28'] ?? null,
          tjc28: answers['ra-tjc28'] ?? null,
          patientGlobal: answers['ra-patient-global'] ?? null,
          providerGlobal: answers['ra-provider-global'] ?? null,
        }),
        das28esr: calculateDAS28ESR({
          sjc28: answers['ra-sjc28'] ?? null,
          tjc28: answers['ra-tjc28'] ?? null,
          esr: answers['ra-esr'] ?? null,
          patientGlobal: answers['ra-patient-global-mm'] ?? null,
        }),
        das28crp: calculateDAS28CRP({
          sjc28: answers['ra-sjc28'] ?? null,
          tjc28: answers['ra-tjc28'] ?? null,
          crp: answers['ra-crp'] ?? null,
          patientGlobal: answers['ra-patient-global-mm'] ?? null,
        }),
        rapid3: calculateRAPID3({
          function0to10: answers['ra-rapid3-function'] ?? null,
          pain0to10: answers['ra-pain-vas'] ?? null,
          globalVAS0to10: answers['ra-patient-global'] ?? null,
        }),
      };
    }
    if (condition === 'psa') {
      return {
        dapsa: calculateDAPSA({
          sjc66: answers['psa-sjc66'] ?? null,
          tjc68: answers['psa-tjc68'] ?? null,
          painVAS: answers['psa-patient-pain'] ?? null,
          patientGlobalVAS: answers['psa-patient-global'] ?? null,
          crp: answers['psa-crp'] ?? null,
        }),
      };
    }
    if (condition === 'axspa') {
      return {
        basdai: calculateBASDAI({
          q1Fatigue: answers['axspa-basdai-q1'] ?? null,
          q2SpinalPain: answers['axspa-basdai-q2'] ?? null,
          q3JointPain: answers['axspa-basdai-q3'] ?? null,
          q4Enthesitis: answers['axspa-basdai-q4'] ?? null,
          q5MorningStiffnessSeverity: answers['axspa-basdai-q5'] ?? null,
          q6MorningStiffnessDuration: answers['axspa-basdai-q6'] ?? null,
        }),
        asdasCrp: calculateASDASCRP({
          backPain: answers['axspa-basdai-q2'] ?? null,
          morningStiffness: answers['axspa-basdai-q6'] ?? null,
          patientGlobal: answers['axspa-patient-global'] ?? null,
          peripheralPain: answers['axspa-basdai-q3'] ?? null,
          crp: answers['axspa-crp'] ?? null,
        }),
        asdasEsr: calculateASDASSER({
          backPain: answers['axspa-basdai-q2'] ?? null,
          morningStiffness: answers['axspa-basdai-q6'] ?? null,
          patientGlobal: answers['axspa-patient-global'] ?? null,
          peripheralPain: answers['axspa-basdai-q3'] ?? null,
          esr: answers['axspa-esr'] ?? null,
        }),
      };
    }
    if (condition === 'fibro') {
      return {
        fsq: calculateFSQ({
          wpiScore: answers['fibro-wpi'] ?? null,
          sssScore: answers['fibro-sss'] ?? null,
        }),
      };
    }
    return {};
  }, [answers, condition]);
}
