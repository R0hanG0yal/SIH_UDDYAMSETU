import React, { createContext, useContext, useMemo, useState } from 'react';
import { SCHEMES_CATALOG } from '../data/mockEngineData';

const SaarthiContext = createContext(null);

function findPossibleScheme(projectCost) {
  return SCHEMES_CATALOG.find((scheme) =>
    scheme.id !== 'NSFDC_EDUCATION_LOAN' &&
    projectCost >= scheme.minCost &&
    projectCost <= scheme.maxCost
  ) || null;
}

export function SaarthiProvider({ children }) {
  const [lang, setLang] = useState('hi');
  const [applicant, setApplicant] = useState({
    projectCost: 50000
  });

  const activeMatch = useMemo(() => ({
    scheme: findPossibleScheme(applicant.projectCost),
    explainableReason:
      'This possible match is based only on the project-cost range in the bundled demonstration catalogue. Other eligibility conditions are not checked.'
  }), [applicant.projectCost]);

  const updateApplicantProfile = (updates = {}) => {
    setApplicant((previous) => {
      if (Number.isFinite(updates.projectCost)) {
        return {
          ...previous,
          projectCost: Math.min(5000000, Math.max(50000, Math.round(updates.projectCost)))
        };
      }
      return previous;
    });
  };

  return (
    <SaarthiContext.Provider value={{
      lang,
      setLang,
      applicant,
      updateApplicantProfile,
      activeMatch
    }}>
      {children}
    </SaarthiContext.Provider>
  );
}

export function useSaarthi() {
  const context = useContext(SaarthiContext);
  if (!context) throw new Error('useSaarthi must be used within a SaarthiProvider');
  return context;
}
