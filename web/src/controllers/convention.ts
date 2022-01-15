import { nanoid } from 'nanoid';

export type Convention = {
  id: string;
  title: string;
  date: Date;
  place: string;
  note: string;
};

export const createConvention = (): Convention => ({
  id: nanoid(),
  title: '',
  date: new Date(),
  place: '',
  note: '',
});
