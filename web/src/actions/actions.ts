import { actionCreatorFactory } from 'typescript-fsa';
import { Convention } from '../controllers/convention';
import { Score } from '../controllers/score';

const ac = actionCreatorFactory('actions');

export const setCourseScore =
  ac<{ conventionId: string; score: Score; index: number }>('set-course-score');

export const setOpenDialogForPlayer = ac<boolean>('set-open-dialog-for-player');

export const setOpenDialogForConvention = ac<boolean>(
  'set-open-dialog-for-convention',
);

export const addConvention = ac<Convention>('add-convention');
