import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { GlobalState, initGlobalState } from './globalState';
import * as actions from './actions/actions';
import { createScore } from './controllers/score';

export const reducer = (partialState: Partial<GlobalState> = {}) => {
  const defaultInit = initGlobalState();
  const initState = { ...defaultInit, ...partialState };
  return reducerWithInitialState(initState)
    .case(actions.setCourseScore, (state, payload) => {
      const newState = { ...state };
      newState.conventionList = [...state.conventionList];
      const convention = newState.conventionList.find(
        (a) => a.id === payload.conventionId,
      );
      if (!convention) return state;
      convention.scores = [...convention.scores];
      const { index, score } = payload;
      convention.scores[index] = score;
      return newState;
    })
    .case(actions.setDialogForPlayer, (state, payload) => {
      const newState = { ...state };
      newState.playerDialog = { ...state.playerDialog, ...payload };
      return newState;
    })
    .case(actions.setDialogForConvention, (state, payload) => ({
      ...state,
      conventionDialog: { ...state.conventionDialog, ...payload },
    }))
    .case(actions.addConvention, (state, payload) => ({
      ...state,
      conventionList: [...state.conventionList, payload],
    }))
    .case(actions.addPlayer, (state, payload) => {
      const conv = state.conventionList.find(
        (c) => c.id === payload.conventionId,
      );
      if (!conv) return state;
      conv.scores = [...conv.scores, createScore(payload.player)];
      const newConvList = [
        conv,
        ...state.conventionList.filter((c) => c.id !== payload.conventionId),
      ];
      return { ...state, conventionList: newConvList };
    })
    .build();
};
