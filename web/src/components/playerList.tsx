import { Container } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCourseScore } from '../actions/actions';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';
import { LaneHeader } from './laneHeader';
import { PlayerLane } from './playerLane';

export const PlayerList: React.FC = () => {
  const { scores } = useSelector<GlobalState, GlobalState>((a) => a);
  const dispatch = useDispatch();
  const onChange = useCallback(
    (score: Score, index: number) => {
      dispatch(setCourseScore({ score, index }));
    },
    [dispatch],
  );
  const rows = useMemo(() => {
    return scores.map((s, i) => (
      <PlayerLane key={i} index={i} score={s} onChange={onChange} />
    ));
  }, [onChange, scores]);
  return (
    <>
      <Container maxWidth="lg">
        <LaneHeader />
        {rows}
      </Container>
    </>
  );
};
