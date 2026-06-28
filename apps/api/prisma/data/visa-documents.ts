export interface VisaDocumentSeed {
  documentName: string;
  description: string;
  category: 'education' | 'identity' | 'employment' | 'financial' | 'other';
  isRequiredForBlueCard: boolean;
  sortOrder: number;
}

export const visaDocuments: VisaDocumentSeed[] = [
  { documentName: 'Valid Passport', description: 'Must be valid for at least the duration of the intended stay.', category: 'identity', isRequiredForBlueCard: true, sortOrder: 1 },
  { documentName: 'Passport-Style Biometric Photos', description: 'Standard German visa application photo specifications.', category: 'identity', isRequiredForBlueCard: true, sortOrder: 2 },
  { documentName: 'Degree Certificate (Original + Apostille)', description: 'B.Tech certificate, apostilled in India.', category: 'education', isRequiredForBlueCard: true, sortOrder: 3 },
  { documentName: 'Degree Recognition Check (anabin database)', description: 'Confirm university/degree recognised in Germany via anabin.kmk.org.', category: 'education', isRequiredForBlueCard: true, sortOrder: 4 },
  { documentName: 'Signed Employment Contract', description: 'Must meet the EU Blue Card minimum salary threshold.', category: 'employment', isRequiredForBlueCard: true, sortOrder: 5 },
  { documentName: 'CV / Resume (Europass or similar format)', description: 'German-market-formatted resume.', category: 'employment', isRequiredForBlueCard: false, sortOrder: 6 },
  { documentName: 'Proof of Health Insurance', description: 'Valid in Germany from the date of arrival.', category: 'financial', isRequiredForBlueCard: true, sortOrder: 7 },
  { documentName: 'Proof of Accommodation in Germany', description: 'Rental contract or landlord confirmation for Anmeldung.', category: 'other', isRequiredForBlueCard: false, sortOrder: 8 },
  { documentName: 'Completed Visa Application Form', description: 'National visa application form for the German consulate.', category: 'identity', isRequiredForBlueCard: true, sortOrder: 9 },
  { documentName: 'Proof of Academic/Professional Qualification Equivalence', description: '9+ years professional experience documentation.', category: 'education', isRequiredForBlueCard: false, sortOrder: 10 },
  { documentName: 'Bank Statements (Financial Proof)', description: 'Recent bank statements showing sufficient funds.', category: 'financial', isRequiredForBlueCard: false, sortOrder: 11 },
  { documentName: 'Visa Appointment Confirmation', description: 'Booking confirmation for the consulate appointment.', category: 'other', isRequiredForBlueCard: true, sortOrder: 12 },
];
