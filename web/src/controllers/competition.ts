import { Competition } from '@amori-score/models';
import { nanoid } from 'nanoid';

export const createCompetition = (): Competition => ({
  id: nanoid(),
  title: '',
  date: new Date(),
  place: '',
  note: '',
  scores: [],
  courseCount: 9,
});
