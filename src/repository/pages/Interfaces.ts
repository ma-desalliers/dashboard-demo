
export interface Page {
  uuid: string;
  type: string;
  language: string;
  clientUuid: string;
  marketUuid?: string;
  subjobUuid?: string;
  relevancyScore?: number;
  title: string;
  sections: PageSection[];
  updatedAt: number;
  createdAt: number;
}

export interface RawPage {
  _uuid: string;
  props: Omit<Page, 'uuid' | 'createdAt'>,
  createdAt: string;
}

export interface PageSection {
  uuid: string;
  pageUuid: string;
  type: string;
  index: number;
  elements: PageElement[];
  createdAt: number;
}

export interface PageElement {
  uuid: string;
  pageUuid: string;
  sectionUuid: string;
  index: number;
  type: string;
  data: any;
  createdAt: number;
}


export interface GeneratePageRequestBody {
  clientUuid: string;
  productUuid: string;
  audienceUuid: string;
  pageTitle: string;
  pageFormat: string;
  language: string;
  metadata?: {
    headingCount?: string;
    wordCount?: string;
    imageCount?: string;
    terms?: string[];
    faq?: string[];
  }
}