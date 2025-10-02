export interface PreferencesState {
  email: string
  maskedEmail: string
  firstName: string
  lastName: string
  company: string
  source: 'social' | 'search' | 'friend' | 'other' | ''
  newsletter: boolean
  currentStep: 'initial' | 'email_input' | 'totp_input' | 'preferences_form'
  isLoading: boolean
  message: string
  messageType: 'success' | 'error' | 'info' | ''
  totpCode: string
}

export interface VerifyLinkResponse {
  canUpdate: boolean;
  email: string;
  maskedEmail: string;
  message: string;
  data?: {
    firstName: string;
    lastName: string;
    company: string;
    source: 'social' | 'search' | 'friend' | 'other' | '';
    newsletter: boolean;
  };
}

export interface TotpRequestResponse {
  maskedEmail: string;
  email: string;
  message: string;
}

export interface UpdatePreferencesResponse {
  message: string;
  data: {
    firstName: string;
    lastName: string;
    company: string;
    source: string;
    newsletter: boolean;
    email: string;
    id: string;
  };
}
