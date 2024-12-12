export interface productObject {
  uuid: string;
  clientUuid: string;
  name: string;
  description: string;
  image: string;
  ctaName: string,
  ctaLink: string,
  benefits:string,
  createdAt?: Date; // Added createdAt property
}
