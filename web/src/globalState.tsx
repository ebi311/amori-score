import { Convention } from './controllers/convention';
import { Score } from './controllers/score';

export type GlobalState = {
  courseCount: number;
  scores: Score[];
  eventName: string;
  openPlayerDialog: boolean;
  conventionList: Convention[];
  openConventionDialog: boolean;
};

export const initGlobalState = (): GlobalState => ({
  courseCount: 9,
  scores: [],
  eventName: '',
  openPlayerDialog: false,
  conventionList: [],
  openConventionDialog: false,
});
