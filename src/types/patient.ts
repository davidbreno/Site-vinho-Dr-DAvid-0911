export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string | null;
  status?: 'active' | 'inactive' | string;
  avatar?: string;
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}
