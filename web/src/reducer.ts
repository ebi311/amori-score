import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { GlobalState, initGlobalState } from './globalState';
import * as actions from './actions/actions';

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
    .case(actions.setOpenDialogForPlayer, (state, payload) => {
      const newState = { ...state };
      newState.openPlayerDialog = payload;
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
    .build();
};
