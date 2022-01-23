import { reducerWithInitialState } from 'typescript-fsa-reducers';
import * as actions from './actions/actions';
import { createScore } from './controllers/score';
import { GlobalState, initGlobalState } from './globalState';

export const reducer = (partialState: Partial<GlobalState> = {}) => {
  const defaultInit = initGlobalState();
  const initState = { ...defaultInit, ...partialState };
  return reducerWithInitialState(initState)
    .case(actions.setCourseScore, (state, payload) => {
      const index = state.competitionList.findIndex(
        (a) => a.id === payload.competitionId,
      );
      if (index === -1) return state;
      const compe = { ...state.competitionList[index] };
      const scores = [...compe.scores];
      const scoreIndex = scores.findIndex((a) => a.id === payload.score.id);
      scores[scoreIndex] = payload.score;
      compe.scores = scores;
      state.competitionList[index] = compe;
      return { ...state };
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
      const index = state.competitionList.findIndex((a) => a.id === payload.id);
      if (index === -1) return state;
      state.competitionList[index] = { ...payload };
      return { ...state };
    })
    .case(actions.addPlayer, (state, payload) => {
      const compeIndex = state.competitionList.findIndex(
        (c) => c.id === payload.competitionId,
      );
      if (compeIndex === -1) return state;
      const compe = { ...state.competitionList[compeIndex] };
      compe.scores = [...compe.scores, createScore(payload.player)];
      state.competitionList[compeIndex] = compe;
      return { ...state };
    })
    .case(actions.deleteScore, (state, payload) => {
      const compeIndex = state.competitionList.findIndex(
        (a) => a.id === payload.competitionId,
      );
      if (compeIndex === -1) return state;
      const compe = { ...state.competitionList[compeIndex] };
      const scores = compe.scores.filter((a) => a.id !== payload.scoreId);
      if (!scores) return state;
      compe.scores = scores;
      state.competitionList[compeIndex] = compe;
      return { ...state };
    })
    .case(actions.deleteCompetition, (state, payload) => {
      const newCompeList = state.competitionList.filter(c => c.id !== payload);
      return {...state, competitionList: newCompeList};
    })
    .build();
};
