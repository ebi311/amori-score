import { Competition, Player, Score } from '@amori-score/models';
import { actionCreatorFactory } from 'typescript-fsa';
import { GlobalState } from '../globalState';

const ac = actionCreatorFactory('actions');

export const setCourseScore =
  ac<{ competitionId: string; score: Score }>('set-course-score');

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

export const updatePlayer =
  ac<{ player: Player; competitionId: string }>('add-player');

export const deleteScore =
  ac<{ competitionId: string; scoreId: string }>('delete-score');

export const deleteCompetition = ac<string>('depete-competition');
