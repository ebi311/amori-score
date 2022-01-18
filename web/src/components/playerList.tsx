import { Box, Container } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { setCourseScore } from '../actions/actions';
import { Convention, createConvention } from '../controllers/convention';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';
import { LaneHeader } from './laneHeader';
import { PlayerLane } from './playerLane';

export const PlayerList: React.FC = () => {
  const conventions = useSelector<GlobalState, Convention[]>(
    (a) => a.conventionList,
  );
  const { id } = useParams();
  const { scores, courseCount } = useMemo(
    () => conventions.find((a) => a.id === id) || createConvention(),
    [conventions, id],
  );
  const dispatch = useDispatch();
  // パラメータが変更したときに、データを取り直す

  const onChange = useCallback(
    (score: Score, index: number) => {
      dispatch(setCourseScore({ conventionId: id || '', score, index }));
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
  return (
    <>
      <Container maxWidth="lg">
        <LaneHeader courseCount={courseCount} />
        <Box data-testid="rows">{rows}</Box>
      </Container>
    </>
  );
};
