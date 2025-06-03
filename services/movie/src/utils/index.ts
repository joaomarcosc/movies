import { fromZonedTime } from 'date-fns-tz';

export const getUTCDate = (currDate: Date): Date => {
  return fromZonedTime(currDate, 'UTC');
};
