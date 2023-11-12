'use server';

import { Quote, QuoteStatus } from '../types';

export const quote = async (
  formData: any
): Promise<Quote> => {

  console.log(formData);

  return {
    status: QuoteStatus.CREATED,
    quote: {
      estimatedPlastic: 0,
      estimatedBottles: 0,
      estimatedGlass: 0,
      estimatedCan: 0,
      estimatedReward: 0,
    },
  };
};
