import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from '../globalState';
import { useCommonStyles } from './commonStyles';

export const LaneHeader: React.FC = () => {
  const courseCount = useSelector<GlobalState>((a) => a.courseCount);
  const theme = useTheme();
  const { lane: styles } = useCommonStyles(theme);
  const courses = useMemo(() => {
    return [...Array(courseCount)].map((_, _i) => {
      const i = _i + 1;
      return (
        <Box css={styles.cell} key={i} className="header">
          {i}
        </Box>
      );
    });
  }, [courseCount, styles.cell]);
  return (
    <Box css={styles.root} className="header">
      <Box css={styles.rowHeader}>参加者</Box>
      {courses}
      <Box css={styles.total}>合計</Box>
    </Box>
  );
};
