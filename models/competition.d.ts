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
