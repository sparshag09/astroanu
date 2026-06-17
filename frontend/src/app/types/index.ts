export interface User {
  id: string;
  fullName: string;
  email: string;
  birthPlace?: string;
  birthDate?: string;
  birthTime?: string;
}

export interface Consultation {
  id: string;
  userId: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  birthTime: string;
  topic: string;
  questions: string;
  status: 'pending' | 'completed' | 'processing';
  createdAt: string;
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  dates: string;
}

export interface Horoscope {
  sign: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
}
