import { Competition, createCompetition } from './controllers/competition';
import { Player } from './controllers/player';
import { Score } from './controllers/score';

export type GlobalState = {
  playerDialog: {
    open: boolean;
    player: Player;
  };
  competitionList: Competition[];
  competitionDialog: {
    open: boolean;
    competition: Competition;
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
  competitionList: [],
  competitionDialog: {
    open: false,
    competition: createCompetition(),
  },
});
