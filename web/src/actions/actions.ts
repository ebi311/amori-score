import { actionCreatorFactory } from 'typescript-fsa';
import { Convention } from '../controllers/convention';
import { Player } from '../controllers/player';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';

const ac = actionCreatorFactory('actions');

export const setCourseScore =
  ac<{ conventionId: string; score: Score; index: number }>('set-course-score');

export const setDialogForPlayer = ac<Partial<GlobalState['playerDialog']>>(
  'set-open-dialog-for-player',
);

export const setDialogForConvention = ac<
  Partial<GlobalState['conventionDialog']>
>('set-open-dialog-for-convention');

export const addConvention = ac<Convention>('add-convention');

export const addPlayer =
  ac<{ player: Player; conventionId: string }>('add-player');
