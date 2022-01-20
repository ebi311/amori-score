import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { GlobalState, initGlobalState } from './globalState';
import * as actions from './actions/actions';
import { createScore } from './controllers/score';
import { CompetitionList } from './components/competitionList';

export const reducer = (partialState: Partial<GlobalState> = {}) => {
  const defaultInit = initGlobalState();
  const initState = { ...defaultInit, ...partialState };
  return reducerWithInitialState(initState)
    .case(actions.setCourseScore, (state, payload) => {
      const newState = { ...state };
      newState.competitionList = [...state.competitionList];
      const competition = newState.competitionList.find(
        (a) => a.id === payload.competitionId,
      );
      if (!competition) return state;
      competition.scores = [...competition.scores];
      const { index, score } = payload;
      competition.scores[index] = score;
      return newState;
    })
    .case(actions.setDialogForPlayer, (state, payload) => {
      const newState = { ...state };
      newState.playerDialog = { ...state.playerDialog, ...payload };
      return newState;
    })
    .case(actions.setDialogForCompetition, (state, payload) => ({
      ...state,
      competitionDialog: { ...state.competitionDialog, ...payload },
    }))
    .case(actions.addCompetition, (state, payload) => ({
      ...state,
      competitionList: [...state.competitionList, payload],
    }))
    .case(actions.updateCompetition, (state, payload) => {
      const compeList = [...state.competitionList];
      const index = compeList.findIndex((a) => a.id === payload.id);
      if (index === -1) return state;
      compeList[index] = payload;
      return { ...state, competitionList: compeList };
    })
    .case(actions.addPlayer, (state, payload) => {
      const compe = state.competitionList.find(
        (c) => c.id === payload.competitionId,
      );
      if (!compe) return state;
      compe.scores = [...compe.scores, createScore(payload.player)];
      const newCompeList = [
        compe,
        ...state.competitionList.filter((c) => c.id !== payload.competitionId),
      ];
      return { ...state, competitionList: newCompeList };
    })
    .build();
};
