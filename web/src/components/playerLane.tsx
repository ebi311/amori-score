import { css } from '@emotion/react';
import { Box, useTheme } from '@mui/material';
import clone from 'clone';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Score } from '../controllers/score';
import { GlobalState } from '../globalState';
import { toNumber } from '../utils';
import { useCommonStyles } from './commonStyles';

type Props = {
  index: number;
  score: Score;
  onChange: (score: Score, index: number) => void;
};

export const PlayerLane: React.FC<Props> = (props) => {
  const courseCount = useSelector<GlobalState, number>((a) => a.courseCount);
  const { score, index } = props;
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
  return (
    <Box css={styles.root} data-testid={`score-row-${index}`}>
      <Box css={styles.rowHeader}>
        {player.name}({player.age}歳)
      </Box>
      {cells}
    </Box>
  );
};
