import { BaseRepository } from "@/src/repository/BaseRepository";
import type { FeedbackObject } from "./Interface";

export class Feedback extends BaseRepository {
  uuid?: string = '';
  referenceUuid: string = '';
  referenceType: string = '';
  type: string = '';
  liked: boolean = false;
  data?: any = {};
  createdAt?: number = Date.now();

  constructor(feedbackObj: FeedbackObject | null) {
    super();
    if (feedbackObj) {
      this.uuid = feedbackObj.uuid;
      this.referenceUuid = feedbackObj.referenceUuid;
      this.referenceType = feedbackObj.referenceType;
      this.type = feedbackObj.type;
      this.liked = feedbackObj.liked;
      this.data = feedbackObj.data;
      this.createdAt = feedbackObj.createdAt;
    }
  }

  async get(uuid: string): Promise<FeedbackObject> {
    const endpoint = `/feedbacks/${uuid}`;
    const result = await this.apiRequest<FeedbackObject>(endpoint, { method: 'GET' });
    return result.data;
  }

  async create(): Promise<FeedbackObject> {
    const endpoint = '/feedbacks';
    const createData = {
      referenceUuid: this.referenceUuid,
      referenceType: this.referenceType,
      type: this.type,
      liked: this.liked
    };

    const result = await this.createRequest<FeedbackObject>(endpoint, createData);
    this.uuid = result.uuid;
    return result;
  }

  async update(): Promise<FeedbackObject> {
    const endpoint = `/feedbacks/${this.uuid}`;
    const updateData = {
      referenceUuid: this.referenceUuid,
      referenceType: this.referenceType,
      type: this.type,
      liked: this.liked,
      data: this.data,
    };

    const result = await this.updateRequest<FeedbackObject>(endpoint, updateData);
    return result;
  }
}
