import { Convention, createConvention } from './controllers/convention';
import { Player } from './controllers/player';
import { Score } from './controllers/score';

export type GlobalState = {
  playerDialog: {
    open: boolean;
    player: Player;
  };
  conventionList: Convention[];
  conventionDialog: {
    open: boolean;
    convention: Convention;
  };
};

export const initGlobalState = (): GlobalState => ({
  playerDialog: {
    open: false,
    player: {
      age: -1,
      name: '',
    },
  },
  conventionList: [],
  conventionDialog: {
    open: false,
    convention: createConvention(),
  },
});
