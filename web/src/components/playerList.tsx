import { Box, Container, css, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  addPlayer,
  setCourseScore,
  setDialogForPlayer,
  updateCompetition,
} from '../actions/actions';
import { Competition, createCompetition } from '../controllers/competition';
import { Player } from '../controllers/player';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';
import { useStyles } from './commonStyles';
import { CompetitionDialog } from './competitionDialog';
import { LaneHeader } from './laneHeader';
import { PlayerDialog } from './playerDialog';
import { PlayerLane } from './playerLane';
import { SideMenu } from './sideMenu';

export const PlayerList: React.FC = () => {
  const competitions = useSelector<GlobalState, Competition[]>(
    (a) => a.competitionList,
  );
  const styles = useStyles((theme) => ({
    sideMenu: css`
      border-radius: 5px;
      border: 1px solid ${theme.palette.primary.main};
      background-color: ${theme.palette.background.paper};
      & .MuiListItemButton-root {
        border-radius: 5px;
        &:hover {
          background-color: ${theme.palette.action.focus};
        }
      }
    `,
  }));
  const { id } = useParams();
  const competition = useMemo(
    () => competitions.find((a) => a.id === id) || createCompetition(),
    [competitions, id],
  );
  const { scores, courseCount } = competition;
  const dispatch = useDispatch();
  // パラメータが変更したときに、データを取り直す

  const onChange = useCallback(
    (score: Score, index: number) => {
      dispatch(setCourseScore({ competitionId: id || '', score, index }));
    },
    [dispatch, id],
  );
  const rows = useMemo(() => {
    return scores.map((s, i) => (
      <PlayerLane
        key={i}
        index={i}
        score={s}
        onChange={onChange}
        courseCount={courseCount}
      />
    ));
  }, [courseCount, onChange, scores]);
  const onCommitPlayerDialog = useCallback(
    (player: Player) => {
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
    },
    [dispatch],
  );
  return (
    <>
      <Grid container>
        <Grid item xs="auto" css={styles.sideMenu}>
          <SideMenu competition={competition} />
        </Grid>
        <Grid item xs>
          <Container maxWidth="lg">
            <Typography variant="h4" data-testid="title">
              {competition.title}
            </Typography>
            <Typography variant="subtitle1" data-testid="subtitle">
              {dayjs(competition.date).format('YYYY年M月D日')} 開催場所&#xFF1A;{' '}
              {competition.place}
            </Typography>
            <LaneHeader courseCount={courseCount} />
            <Box data-testid="rows">{rows}</Box>
          </Container>
        </Grid>
      </Grid>
      <PlayerDialog
        onCommit={onCommitPlayerDialog}
        onClose={onClosePlayerDialog}
      />
      <CompetitionDialog onCommit={onCommitCompeDialog} onClose={() => ''} />
    </>
  );
};
