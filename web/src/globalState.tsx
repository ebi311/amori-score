import { Competition, Player } from '@amori-score/models';
import { createCompetition } from './controllers/competition';

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

export const initGlobalState = (): GlobalState => {
  return {
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
  };
};

// 初回ロード要求メッセージ
// (window as any).mainApi.loadData();
