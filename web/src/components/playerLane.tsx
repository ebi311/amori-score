import { css } from '@emotion/react';
import { Box, useTheme, IconButton } from '@mui/material';
import clone from 'clone';
import React, { useCallback, useMemo } from 'react';
import { Player } from '../controllers/player';
import { Score } from '../controllers/score';
import { toNumber } from '../utils';
import { useCommonStyles } from './commonStyles';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

type Props = {
  index: number;
  score: Score;
  courseCount: number;
  onChange: (score: Score, index: number) => void;
  onOpenEditPlayer: (player: Player) => void;
  onDeletePlayer: (score: Score) => void;
};

export const PlayerLane: React.FC<Props> = (props) => {
  const { score, index, courseCount, onOpenEditPlayer, onDeletePlayer } = props;
  const { player } = score;
  const theme = useTheme();
  const { lane: styles } = useCommonStyles(theme);
  const changeScore = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const courseNo = toNumber(e.currentTarget.dataset['index']);
      const value = toNumber(e.currentTarget.value);
      if (courseNo === 0) return;
      const newScore = clone(score);
      newScore.set(courseNo, value);
      props.onChange(newScore, index);
    },
    [index, props, score],
  );

  const cells = useMemo(() => {
    const ret: JSX.Element[] = [];
    [...Array(courseCount)].map((_, _i) => {
      const i = _i + 1;
      const id = `${index}-course-${i}`;
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
  }, [changeScore, courseCount, index, score, styles.cell, styles.total]);
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
    <Box css={styles.root} data-testid={`score-row-${index}`}>
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
