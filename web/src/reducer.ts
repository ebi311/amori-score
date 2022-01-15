import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { GlobalState, initGlobalState } from './globalState';
import * as actions from './actions/actions';

const defaultInit = initGlobalState();

export const reducer = (partialState: Partial<GlobalState> = {}) => {
  const initState = { ...defaultInit, ...partialState };
  return reducerWithInitialState(initState)
    .case(actions.setCourseScore, (state, payload) => {
      const newState = { ...state };
      newState.scores = [...state.scores];
      const { index, score } = payload;
      newState.scores[index] = score;
      return newState;
    })
    .case(actions.setOpenDialogForPlayer, (state, payload) => {
      const newState = { ...state };
      newState.openPlayerDialog = payload;
      return newState;
    })
    .case(actions.setOpenDialogForConvention, (state, payload) => ({
      ...state,
      openConventionDialog: payload,
    }))
    .build();
};
