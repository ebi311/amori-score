import { Competition } from '@amori-score/models';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

type Props = {
  competition: Competition;
};

export const CompetitionHeader: React.FC<Props> = (props) => {
  const { competition } = props;
  return (
    <>
      <Typography variant="h4" data-testid="title">
        {competition.title}
      </Typography>
      <Typography variant="subtitle1" data-testid="subtitle">
        {dayjs(competition.date).format('YYYY年M月D日')} 開催場所&#xFF1A;{' '}
        {competition.place}
      </Typography>
    </>
  );
};
