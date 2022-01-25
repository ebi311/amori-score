import { nanoid } from 'nanoid';
import { Competition } from '../../../models/competition';

export const createCompetition = (): Competition => ({
  id: nanoid(),
  title: '',
  date: new Date(),
  place: '',
  note: '',
  scores: [],
  courseCount: 9,
});
