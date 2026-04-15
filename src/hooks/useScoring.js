import { useMemo } from 'react';
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
} from '../utils/scoreCalculations.js';

export function useScoring(answers) {
  return useMemo(() => {
    const cdai = calculateCDAI({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      patientGlobal: answers['ra-patient-global'] ?? null,
      providerGlobal: answers['ra-provider-global'] ?? null,
    });
    const das28esr = calculateDAS28ESR({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      esr: answers['ra-esr'] ?? null,
      patientGlobal: answers['ra-patient-global-mm'] ?? null,
    });
    const das28crp = calculateDAS28CRP({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      crp: answers['ra-crp'] ?? null,
      patientGlobal: answers['ra-patient-global-mm'] ?? null,
    });
    const rapid3 = calculateRAPID3({
      function0to10: answers['ra-rapid3-function'] ?? null,
      pain0to10: answers['ra-pain-vas'] ?? null,
      globalVAS0to10: answers['ra-patient-global'] ?? null,
    });
    return { cdai, das28esr, das28crp, rapid3 };
  }, [answers]);
}
