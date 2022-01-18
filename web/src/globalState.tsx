import { Convention, createConvention } from './controllers/convention';
import { Score } from './controllers/score';

export type GlobalState = {
  openPlayerDialog: boolean;
  conventionList: Convention[];
  conventionDialog: {
    open: boolean;
    convention: Convention;
  };
};

export const initGlobalState = (): GlobalState => ({
  openPlayerDialog: false,
  conventionList: [],
  conventionDialog: {
    open: false,
    convention: createConvention(),
  },
});
