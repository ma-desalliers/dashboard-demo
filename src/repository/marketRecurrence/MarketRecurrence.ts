import type { marketRecurrenceObject, CampainFrequency } from "@/src/repository/marketRecurrence/Interface";
import { BaseRepository } from "@/src/repository/BaseRepository";
import { date } from 'quasar';
import dateHandler from "~/src/asset/composable/date";

export class MarketRecurrence extends BaseRepository {
  uuid: string = '';
  marketUuid: string = '';
  type: string = '';
  startDate?: number;
  endDate?: number;
  recurrenceFrequency: CampainFrequency = 'daily';
  quantity: number = 0;
  createdAt: number = Date.now(); 
  subIndustryId:string = '';
  gics:any;
  countryId?: number;
  stateId?: number;
  cityId?: number ;
  state:string = ''

  constructor(marketRecurrenceObj: marketRecurrenceObject | null) {
    super();
    if (marketRecurrenceObj) {
      this.uuid = marketRecurrenceObj.uuid;
      this.marketUuid = marketRecurrenceObj.marketUuid;
      this.type = marketRecurrenceObj.type;
      this.startDate = marketRecurrenceObj.startDate;
      this.endDate = marketRecurrenceObj.endDate;
      this.recurrenceFrequency = marketRecurrenceObj.recurrenceFrequency;
      this.quantity = marketRecurrenceObj.quantity;
      this.createdAt = marketRecurrenceObj.createdAt;
      this.state = marketRecurrenceObj.state;
      this.subIndustryId = marketRecurrenceObj.subIndustryId ;
      this.gics = marketRecurrenceObj.gics;
      this.countryId = marketRecurrenceObj.countryId;
      this.stateId = marketRecurrenceObj.stateId;
      this.cityId = marketRecurrenceObj.cityId;
    }
    else{
      this.startDate = new Date().getTime()
      this.quantity = 5
      this.recurrenceFrequency = 'weekly'
      this.type = 'free-trial'
    }
  }

  async create(): Promise<marketRecurrenceObject> {
    const endpoint = `markets/${this.marketUuid}/campaign`;
    const createData = {
      uuid: this.uuid,
      marketUuid: this.marketUuid,
      type: this.type,
      startDate: this.startDate ? dateHandler.dateToESTTimestamp(this.startDate) : undefined,
      endDate: this.endDate ? dateHandler.dateToESTTimestamp(this.endDate) : undefined,
      recurrenceFrequency: this.recurrenceFrequency,
      state: 'active',
      quantity: this.quantity,
      createdAt: this.createdAt,
      subIndustryId: this.subIndustryId,
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId
    };
  
    const result = await this.createRequest<marketRecurrenceObject>(endpoint, createData);
    this.uuid = result.uuid;
    return result;
  }

  async pause(): Promise<void> {
    this.changeRecurrenceState('pause')
  }

  async resume(): Promise<void> {
    this.changeRecurrenceState('resume')
  }

  async stop(): Promise<void> {
    this.changeRecurrenceState('stop')
  }


  async changeRecurrenceState(state:string): Promise<void> {
    const endpoint = `/markets/${this.marketUuid}/campaigns/${this.uuid}/${state}`;
  
    const updateObj = {
      uuid: this.uuid,
      marketUuid: this.marketUuid,
      type: this.type,
      startDate: this.startDate,
      endDate: this.endDate,
      recurrenceFrequency: this.recurrenceFrequency,
      quantity: this.quantity,
      createdAt: this.createdAt,
      state: this.state,
      subIndustryId: this.subIndustryId,
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId
    };
  
    const result = await this.updateRequest<marketRecurrenceObject>(endpoint, updateObj);
    this.state = result.state;
  }

   calculateTotalArticle = () => {
    console.log('calculate total')
    if (!this.startDate || !this.endDate || !this.quantity) return
  
    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    let difference: number = 0
  
    switch (this.recurrenceFrequency) {
      case 'daily':
        const weekdaysCount = dateHandler.countWeekdays(start, end)
        difference = weekdaysCount
        break
      case 'weekly':
        difference = Math.ceil(date.getDateDiff(end, start, 'days') / 7)
        break
      case 'monthly':
        difference = date.getDateDiff(end, start, 'months')
        break
    }
  
    return difference * this.quantity
  }
}
