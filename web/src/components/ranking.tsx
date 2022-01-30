import { Competition } from '@amori-score/models';
import { Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createCompetition } from '../controllers/competition';
import { GlobalState } from '../globalState';
import { CompetitionHeader } from './competitionTitle';
import { SideMenu } from './sideMenu';

export const Ranking: React.FC = () => {
  const { id } = useParams();
  const competition = useSelector<GlobalState, Competition>(
    (a) => a.competitionList.find((a) => a.id === id) || createCompetition(),
  );
  const rankRows = useMemo(() => {
    let preRank = 0;
    return competition.scores
      .sort((a, b) => a.compare(b))
      .map((s, i) => {
        let rank = i + 1;
        const pre = competition.scores[i - 1];
        if (!!pre && s.compare(pre) === 0) {
          rank = preRank;
        } else {
          preRank = rank;
        }
        return [s, rank] as const;
      })
      .map(([s, rank], i) => (
        <ListItem key={s.id} data-testid={`rank-row-${i}`}>
          <ListItemText
            primary={`${rank}位 ${s.player.name}`}
            secondary={`${s.player.age}歳`}
          />
        </ListItem>
      ));
  }, [competition.scores]);
  1;
  return (
    <Grid container>
      <Grid xs={2} item>
        <SideMenu competition={competition} />
      </Grid>
      <Grid xs item>
        <Container maxWidth="xl">
          <CompetitionHeader competition={competition} />
          <List>{rankRows}</List>
        </Container>
      </Grid>
    </Grid>
  );
};
