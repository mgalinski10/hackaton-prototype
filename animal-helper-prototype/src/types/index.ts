export type VerificationStatus = "VERIFIED" | "UNVERIFIED";
export type UserRole = "USER" | "VOLUNTEER" | "ADMIN";

export interface Address {
  id: string;
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;
}

export interface Review {
  id: string;
  name: string;
  surname: string;
  rating: number;
  isVolunteerReview: boolean;
  comment: string;
  photoUrl?: string;
  createdAt: string;
  surveyAnswers?: SurveyAnswer[];
}

export interface SurveyAnswer {
  questionId: string;
  questionText: string;
  answerValue: number;
}

export interface Shelter {
  id: string;
  name: string;
  address: Address;
  lon: number;
  lat: number;
  verificationStatus: VerificationStatus;
  documentPath?: string;
  imageUrl?: string;
  isPrimaryShelter: boolean;
  reviews: Review[];
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  currentAnimals?: number;
}

export type AnimalSpecies = "dog" | "cat" | "other";
export type AnimalStatus = "available" | "reserved" | "adopted";
export type AnimalGender = "male" | "female";

export interface Animal {
  id: string;
  shelterId: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  age: number; // months
  gender: AnimalGender;
  imageUrl: string;
  description: string;
  status: AnimalStatus;
  vaccinated: boolean;
  sterilized: boolean;
  arrivedAt: string;
}

export interface VolunteerShift {
  id: string;
  date: string;
  startHour: number;
  endHour: number;
  shelterName: string;
  task: string;
  status: "upcoming" | "completed";
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  name: string;
  surname: string;
  email: string;
  motivation: string;
  documentName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

export interface SurveyQuestion {
  id: string;
  questionText: string;
  order: number;
  isVolunteerQuestion: boolean;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
}
