export enum QuoteStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CREATED = 'CREATED',
}

export interface Quote {
  status: QuoteStatus;
  quote: {
    estimatedPlastic: number;
    estimatedBottles: number;
    estimatedGlass: number;
    estimatedCan: number;
    estimatedReward: number;
  } | null;
}
