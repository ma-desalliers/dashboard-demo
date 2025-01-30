// pages.ts
export const samplePages = [
  {
    uuid: '1',
    title: 'How to improve product retention strategies',
    review: true,
    relevancy: 'Excellent',
    channel: 'Search Engine',
    buyingStage: 'Awareness',
    format: 'How-To-Guide',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/product-retention-guide'
  },
  {
    uuid: '2',
    title: 'Best practices for customer engagement',
    review: true,
    relevancy: 'Excellent',
    channel: 'Search Engine',
    buyingStage: 'Awareness',
    format: 'Skyscraper',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/customer-engagement'
  },
  {
    uuid: '3',
    title: '10 Ways to Reduce Customer Churn',
    review: true,
    relevancy: 'Good',
    channel: 'Search Engine',
    buyingStage: 'Consideration',
    format: 'Product page',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/reduce-churn'
  },
  {
    uuid: '4',
    title: 'Monthly Product Updates and News',
    review: true,
    relevancy: 'Good',
    channel: 'Newsletter',
    buyingStage: 'Consideration',
    format: 'Newsletter',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/product-updates'
  },
  {
    uuid: '5',
    title: 'Enterprise Solution Feature Comparison',
    review: false,
    relevancy: 'Average',
    channel: 'LinkedIn',
    buyingStage: 'Decision',
    format: 'Email',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/enterprise-comparison'
  },
  {
    uuid: '6',
    title: 'Special Offer: Premium Plan Discount',
    review: false,
    relevancy: 'Average',
    channel: 'Facebook',
    buyingStage: 'Decision',
    format: 'Post promo',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/premium-discount'
  },
  {
    uuid: '7',
    title: 'Customer Success Story: Company X',
    review: false,
    relevancy: 'Average',
    channel: 'X',
    buyingStage: 'Retention',
    format: 'Story',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/success-story'
  },
  {
    uuid: '8',
    title: 'Product Feature Spotlight: New Analytics Dashboard',
    review: false,
    relevancy: 'Average',
    channel: 'Google Profile',
    buyingStage: 'Retention',
    format: 'Post',
    creationDate: '15 Jan. 2025',
    url: 'https://example.com/feature-spotlight'
  }
]

// Constants for reference and filtering
export const channels = [
  'Search Engine',
  'Newsletter',
  'LinkedIn',
  'Facebook',
  'X',
  'Google Profile'
]

export const buyingStages = [
  'Awareness',
  'Consideration',
  'Decision',
  'Retention'
]

export const formats = [
  'How-To-Guide',
  'Skyscraper',
  'Product page',
  'Newsletter',
  'Email',
  'Post promo',
  'Story',
  'Post'
]

export const relevancyLevels = [
  'Excellent',
  'Good',
  'Average'
]