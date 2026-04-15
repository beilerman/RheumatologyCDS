export function getRecommendations(state, rules, guidelines) {
  return rules
    .filter((rule) => {
      try {
        return rule.condition(state);
      } catch {
        return false;
      }
    })
    .map((rule) => {
      const specialFlags = (rule.specialPopulations || [])
        .filter((sp) => {
          try {
            return sp.condition(state);
          } catch {
            return false;
          }
        })
        .map((sp) => sp.note);

      return {
        id: rule.id,
        recommendation: rule.recommendation,
        strength: rule.strength,
        guideline: rule.guideline,
        guidelineRef: guidelines[rule.guideline] || null,
        rationale: rule.rationale,
        specialFlags,
      };
    })
    .sort((a, b) => {
      const order = { strong: 0, conditional: 1 };
      return (order[a.strength] ?? 2) - (order[b.strength] ?? 2);
    });
}
