'use client';
import { createContext, useContext, useState } from 'react';

const WizardContext = createContext(null);

const initialFormData = {
  // Company Details
  legalNameEn: '',
  legalNameAr: '',
  crNumber: '',
  vatYear: '',
  orgType: '',
  sector: '',
  headOfficeEn: '',
  headOfficeAr: '',
  nationalAddressKsa: '',
  detailedAddress: '',
  contactInfo: '',
  crDocument: null,
  vatDocument: null,
  nationalAddressDoc: null,
  ibanDocument: null,
  certAreasEn: '',
  certScopeAr: '',
  multisite: '',
  siteDetails: [{ nameEn: '', nameAr: '', addressEn: '', addressAr: '', activitiesEn: '', activitiesAr: '', scopeEn: '', scopeAr: '' }],
  totalEmployees: '',
  permanentEmployees: '',
  contractEmployees: '',
  numberOfSites: '',
  shiftOperations: '',
  remoteWork: '',
  // Brand Details (updated)
  coreBusinessActivities: '',
  keyProductsEn: '',
  keyProductsAr: '',
  criticalProcesses: '',
  outsourcedProcesses: '',
  brands: [{ name: '', skus: '' }],
  // Certifications
  iso9001: '',
  iso14001: '',
  iso45001: '',
  iso22000: '',
  iso50001: '',
  otherCerts: '',
  // ESG
  esgProgram: '',
  esgGovernance: '',
  sustainabilityStrategy: '',
  ghgMonitoring: '',
  energyManagement: '',
  socialResponsibility: '',
  esgCompliance: '',
  additionalNotes: '',
  supportingDocs: null,

  // Survey answers per section (section-1 through section-4)
  survey: {},
  // Partial explanations
  partialExplanations: {},

  // Social Responsibility checkboxes (section-2)
  socialResponsibilityInitiatives: [],

  // Certification type selection
  selectedCertType: null,

  agreedToTerms: false,
};

export function WizardProvider({ children }) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSurvey = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      survey: { ...prev.survey, [questionId]: value },
    }));
  };

  const updatePartialExplanation = (questionId, text) => {
    setFormData((prev) => ({
      ...prev,
      partialExplanations: { ...prev.partialExplanations, [questionId]: text },
    }));
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  return (
    <WizardContext.Provider
      value={{
        formData,
        setFormData,
        updateField,
        updateSurvey,
        updatePartialExplanation,
        clearForm,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
