export interface ProfilerForm {
  pension: {
    answer_1: { value: number; content: string };
    answer_2: { value: number; content: string };
    answer_3: { value: number; content: string };
  };
  financial: {
    answer_1: { value: number; content: string };
    answer_2: { value: number; content: string };
    answer_3: { value: number; content: string };
    answer_4: { value: number; content: string };
    answer_5: { value: number; content: string };
    answer_6: { value: number; content: string };
  };
  tributary: {
    answer_1: { value: number; content: string };
  };
  patrimony: {
    answer_1: { value: number; content: string };
    answer_2: { value: number; content: string };
  };
}
export interface ProfilerBasicData {
  name: string;
  income: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phoneNumber: string;
  tyc: boolean;
  tycAcceptedAt: string | null;
}

export interface ProfilerFormState {
  step: number;
  subStep: number;
  hasBasicInfo: boolean;
  hasCompletedOnboarding: boolean;
  basicData: ProfilerBasicData;
  formData: ProfilerForm;
}
