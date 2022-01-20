import { nanoid } from 'nanoid';
import { Score } from './score';

export type Competition = {
  id: string;
  title: string;
  date: Date;
  place: string;
  note: string;
  scores: Score[];
  courseCount: number;
};

export const createCompetition = (): Competition => ({
  id: nanoid(),
  title: '',
  date: new Date(),
  place: '',
  note: '',
  scores: [],
  courseCount: 9,
});
