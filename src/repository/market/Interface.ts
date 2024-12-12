import type { personaObject } from "../persona/Interface";
import type { productObject } from "../product/Interface";


export interface marketObject { 
  clientUuid: string;
  persona: personaObject
  personaUuid: string;
  product: productObject;
  productUuid: string;
  isActive: boolean;
  uuid: string;
  createdAt?: Date; // Added createdAt property
}
