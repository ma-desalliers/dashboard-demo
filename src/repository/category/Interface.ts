export interface categoryObject {
  uuid: string;
  clientUuid: string;
  name: string;
  description: string;
  parentUuid: string | null;
  createdAt?: Date;
}
