export interface pageObject {
  uuid: string;
  title: string;
  content: string;
  createdAt:string; 
  isPublished:boolean;
  clientUuid:string;
  marketUuid:string;
  score:number;
  type:string;
  language:string;
  hasContent:boolean;
  positiveLikes:number,
  negativeLikes:number
}

export interface pageOutlineObject{
  content:string;
  createdAt:string
  image: string
  uuid: string
}
