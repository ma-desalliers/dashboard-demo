export interface FeedbackObject {
  uuid?: string;
  referenceUuid: string;
  referenceType: string;
  type: string;
  liked: boolean;
  data?: any;
  createdAt?: number;
}
