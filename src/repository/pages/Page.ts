// Pages.ts

import type { pageObject, pageOutlineObject } from "./Interface";
import { BaseRepository } from "@/src/repository/BaseRepository";
import { Product } from "../product/Product";
import { Persona } from "../persona/Persona";
import type { productObject } from "../product/Interface";
import type { personaObject } from "../persona/Interface";
import constant from "@/src/asset/constant/constant";
import { Market } from "../market/Market";
import type { marketObject } from "../market/Interface";
import { Feedback } from '../feedback/Feedback';
import type { FeedbackObject } from "../feedback/Interface";


export class Pages extends BaseRepository {
  uuid: string = '';
  title: string = '';
  content: string = '';
  createdAt:string = ''; 
  isPublished?:boolean;
  clientUuid:string = '';
  marketUuid:string = '';
  language?:string
  hasContent:Boolean = false
  score:number = 0;
  type:string = 'Listicle';
  outline?:pageOutlineObject;
  cro?:croObject
  croImageUrl?:string
  contentIsGenerated?:boolean
  comment?:string;
  positiveLikes?:number;
  negativeLikes?:number


  product?: Product
  persona?: Persona
  market ?:Market
  feedback? : Feedback[]

  constructor(pageObj: pageObject | null) {
    super();
    if (pageObj) {
      this.uuid = pageObj.uuid;
      this.title = pageObj.title;
      this.content = pageObj.content;
      this.createdAt = pageObj.createdAt;
      this.isPublished = pageObj.isPublished;
      this.clientUuid  = pageObj.clientUuid;
      this.marketUuid = pageObj.marketUuid;
      this.language = pageObj.language
      this.hasContent = pageObj.hasContent
      this.score = pageObj.score;
      this.positiveLikes =  pageObj.positiveLikes
      this.negativeLikes =  pageObj.negativeLikes
    }
  }

  public getFullPage = async() => {
    try {
      const response = await this.apiRequest<fullPageResponse>(
        `pages/${this.uuid}`
      );
      console.log(response)
      if(response && response.data.page && response.data.page.uuid){
        this.outline = response.data?.outline as pageOutlineObject
        this.cro = response.data?.cro
        this.croImageUrl = `${constant.basePictureUrl}${this.cro.image}`
        this.contentIsGenerated = true
      }
      else{
        this.contentIsGenerated = false
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  public getMarkets = async () => {
    if (!this.product && !this.persona) {
      try {
        const response = await this.apiRequest<marketObject>(
          `markets/${this.marketUuid}`
        );

        this.market = new Market(response.data)
        
        this.market.product = new Product(response.data.product);
        this.market.persona = new Persona(response.data.persona);

        return this.market
      } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }
    }
    
    return {
      product: this.product,
      persona: this.persona
    };
  }

  public getFeedback = async () =>{
    const response = await this.apiRequest<FeedbackObject[]>(
      `feedbacks/${this.uuid}`
    );
    this.feedback = response.data.map((feedback:FeedbackObject) => new Feedback(feedback) )

    return this.feedback
  }

  public addFeedback = async (liked:boolean) =>{
    const feedback:FeedbackObject = {
      referenceUuid: this.uuid,
      referenceType:'posts',
      type:'internal',
      liked,
    }

    const newFeedback = new Feedback(feedback)

    newFeedback.create()

    this.feedback?.push(newFeedback)
  }

  public generate = async () =>{
    const result = await this.jobRequest(`pages/${this.uuid}/generate`,{language: this.language}, 'Generate successful this page will be ready in a few minutes')

      console.log(`result ${result}`)
      if(result){
        this.localStorageStore.initializeFromStorage()
        if(!this.localStorageStore.data || !this.localStorageStore.data.jobs){
          this.localStorageStore.data = {
            jobs:[]
          }
        }
  
        this.localStorageStore.data.jobs.push({
          itemName: `${this.title}`,
          type:'page',
          jobId: result.jobId,
          uuid:this.uuid
        })

        this.localStorageStore.setData(this.localStorageStore.data)
        this.localStorageStore.saveToStorage()
      }
  }

  public email = async () =>{
    const response = await this.apiRequest<MarketResponse>(
      `pages/${this.uuid}/email`,
      {
        method: 'POST',
        body:{language: this.language}
    })

    if(response.status == 200){
      this.notificationStore.showSuccess('Email successfully sent')
    } 
  }
}

interface croObject{
  content:string
  image:string
}

interface fullPageResponse{
    outline:pageOutlineObject
    cro:croObject
    page:{content:string, image:string, uuid: string}
}

interface MarketResponse {
  product: productObject;
  persona: personaObject;
}
