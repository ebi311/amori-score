import { Competition, Player, Score } from '@amori-score/models';
import { Box, Container, Grid } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  addPlayer,
  deleteScore,
  setDialogForCompetition,
  setDialogForPlayer,
  updateCompetition,
} from '../actions/actions';
import { createCompetition } from '../controllers/competition';
import { GlobalState } from '../globalState';
import { CompetitionDialog } from './competitionDialog';
import { CompetitionHeader } from './competitionTitle';
import { LaneHeader } from './laneHeader';
import { PlayerDialog } from './playerDialog';
import { PlayerLane } from './playerLane';
import { SideMenu } from './sideMenu';

export const PlayerList: React.FC = () => {
  const { id } = useParams();
  const competition = useSelector<GlobalState, Competition>(
    (a) => a.competitionList.find((a) => a.id === id) || createCompetition(),
  );
  // const competition = useMemo(
  //   () => competitions.find((a) => a.id === id) || createCompetition(),
  //   [competitions, id],
  // );
  const { scores, courseCount } = competition;
  const dispatch = useDispatch();
  // パラメータが変更したときに、データを取り直す

  const onEditPlayer = useCallback(
    (player: Player) => {
      dispatch(
        setDialogForPlayer({
          open: true,
          player,
          isNew: false,
        }),
      );
    },
    [dispatch],
  );
  const onDeletePlayer = useCallback(
    (score: Score) => {
      dispatch(
        deleteScore({ competitionId: competition.id, scoreId: score.id }),
      );
    },
    [competition.id, dispatch],
  );
  const rows = useMemo(() => {
    return scores.map((s) => (
      <PlayerLane
        key={s.id}
        competitionId={competition.id}
        scoreId={s.id}
        onOpenEditPlayer={onEditPlayer}
        onDeletePlayer={onDeletePlayer}
      />
    ));
  }, [competition.id, onDeletePlayer, onEditPlayer, scores]);
  const onCommitPlayerDialog = useCallback(
    (player: Player, isNew: boolean) => {
      if (!id) return;
      dispatch(addPlayer({ player, competitionId: id }));
      dispatch(
        setDialogForPlayer({ open: false, player: { name: '', age: -1 } }),
      );
    },
    [dispatch, id],
  );
  const onClosePlayerDialog = useCallback(() => {
    dispatch(setDialogForPlayer({ open: false }));
  }, [dispatch]);
  const onCommitCompeDialog = useCallback(
    (compe: Competition) => {
      dispatch(updateCompetition(compe));
      dispatch(
        setDialogForCompetition({
          open: false,
          competition: createCompetition(),
        }),
      );
    },
    [dispatch],
  );
  const onCloseCompeDialog = useCallback(() => {
    dispatch(
      setDialogForCompetition({
        open: false,
        competition: createCompetition(),
      }),
    );
  }, [dispatch]);
  return (
    <>
      <Grid container>
        <Grid item xs={2}>
          <SideMenu competition={competition} />
        </Grid>
        <Grid item xs>
          <Container maxWidth="xl">
            <CompetitionHeader competition={competition} />
            <LaneHeader courseCount={courseCount} />
            <Box data-testid="rows">{rows}</Box>
          </Container>
        </Grid>
      </Grid>
      <PlayerDialog
        onCommit={onCommitPlayerDialog}
        onClose={onClosePlayerDialog}
      />
      <CompetitionDialog
        onCommit={onCommitCompeDialog}
        onClose={onCloseCompeDialog}
      />
    </>
  );
};
