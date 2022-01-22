import { css } from '@emotion/react';
import { Box, useTheme, IconButton } from '@mui/material';
import clone from 'clone';
import React, { useCallback, useMemo } from 'react';
import { Player } from '../controllers/player';
import { Score } from '../controllers/score';
import { toNumber } from '../utils';
import { useCommonStyles } from './commonStyles';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalState } from '../globalState';
import { setCourseScore } from '../actions/actions';

type Props = {
  competitionId: string;
  scoreId: string;
  onOpenEditPlayer: (player: Player) => void;
  onDeletePlayer: (score: Score) => void;
};

export const PlayerLane: React.FC<Props> = (props) => {
  const { onOpenEditPlayer, onDeletePlayer, competitionId } = props;
  const [score, courseCount] = useSelector<GlobalState, [Score, number]>(
    (s) => {
      const compe = s.competitionList.find((a) => a.id === props.competitionId);
      const score = compe?.scores.find((a) => a.id === props.scoreId);
      if (!compe || !score) throw new Error('not found score.');
      return [score, compe.courseCount];
    },
  );
  const { player } = score;
  const theme = useTheme();
  const { lane: styles } = useCommonStyles(theme);
  const dispatch = useDispatch();
  const changeScore = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const courseNo = toNumber(e.currentTarget.dataset['index']);
      const value = toNumber(e.currentTarget.value);
      if (courseNo === 0) return;
      const newScore = clone(score);
      newScore.set(courseNo, value);
      dispatch(setCourseScore({ competitionId, score: newScore }));
    },
    [competitionId, dispatch, score],
  );

  const cells = useMemo(() => {
    const ret: JSX.Element[] = [];
    [...Array(courseCount)].map((_, _i) => {
      const i = _i + 1;
      const id = `${score.id}-course-${i}`;
      const s = score.get(i)?.toString() || '';
      ret.push(
        <Box css={styles.cell} key={id}>
          <input
            data-testid={id}
            data-index={i}
            value={s}
            type="number"
            onChange={changeScore}
          />
        </Box>,
      );
    });
    // 合計
    ret.push(
      <Box
        key="total"
        css={css`
          ${styles.cell};
          ${styles.total};
        `}
        data-testid="total"
      >
        {score.total()}
      </Box>,
    );
    return ret;
  }, [changeScore, courseCount, score, styles.cell, styles.total]);
  const onClickEdit = useCallback(() => {
    onOpenEditPlayer(score.player);
  }, [onOpenEditPlayer, score.player]);
  const onClickDeleteButton = useCallback(() => {
    if (
      !window.confirm(
        `${score.player.name} さんを削除します。\nよろしいですか？`,
      )
    )
      return;
    onDeletePlayer(score);
  }, [onDeletePlayer, score]);
  return (
    <Box css={styles.root} data-testid={`score-row-${score.id}`}>
      <Box css={styles.rowHeader}>
        {player.name}({player.age}歳)
        <Box>
          <IconButton
            data-testid="edit-player"
            size="small"
            onClick={onClickEdit}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            data-testid="delete-player"
            size="small"
            onClick={onClickDeleteButton}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      {cells}
    </Box>
  );
};
