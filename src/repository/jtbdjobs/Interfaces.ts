export interface JTBD {
  uuid: string
  clientUuid: string
  marketUuid: string
  parentUuid: string
  title: string
  description: string
  relevancyScore: number
  type: string
  createdAt: number
}

export interface JTBDFilters {
  clientUuid: string
  marketUuid?: string
  parentUuid?: string
  audienceUuid? : string
  isChild?: boolean
  withPage?: boolean
}
