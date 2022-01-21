import { actionCreatorFactory } from 'typescript-fsa';
import { Competition } from '../controllers/competition';
import { Player } from '../controllers/player';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';

const ac = actionCreatorFactory('actions');

export const setCourseScore =
  ac<{ competitionId: string; score: Score; index: number }>(
    'set-course-score',
  );

export const setDialogForPlayer = ac<Partial<GlobalState['playerDialog']>>(
  'set-open-dialog-for-player',
);

export const setDialogForCompetition = ac<
  Partial<GlobalState['competitionDialog']>
>('set-open-dialog-for-competition');

export const addCompetition = ac<Competition>('add-competition');

export const updateCompetition = ac<Competition>('update-competition');

export const addPlayer =
  ac<{ player: Player; competitionId: string }>('add-player');

export const deleteScore =
  ac<{ competitionId: string; scoreId: string }>('delete-score');
