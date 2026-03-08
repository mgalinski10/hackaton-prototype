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
  adoptionRate: number;       // % zwierząt które trafiają do adopcji
  mortalityRate: number;      // % śmiertelności
  avgStayDays: number;        // średnia liczba dni do adopcji
  animalsAdoptedThisYear: number;
  animalsIncomingThisYear: number;
  reviews: Review[];
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  currentAnimals?: number;
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

export type AnomalyType = "SUDDEN_DROP" | "SUDDEN_SPIKE";
export type TaskStatus = "PENDING_ACCEPT" | "ACCEPTED" | "COMPLETED";

export interface InspectionTask {
  id: string;
  shelterId: string;
  shelterName: string;
  shelterLat: number;
  shelterLon: number;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  status: TaskStatus;
  anomalyType: AnomalyType;
  avgBefore: number;
  avgAfter: number;
  detectedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  linkedReviewId?: string;
}

export interface MockVolunteer {
  id: string;
  name: string;
  surname: string;
  email: string;
  lat: number;
  lon: number;
}
