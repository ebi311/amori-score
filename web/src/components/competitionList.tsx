import { Competition } from '@amori-score/models';
import {
  Box,
  Button,
  css,
  List,
  ListItemButton,
  ListItemText,
  Theme,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addCompetition, setDialogForCompetition } from '../actions/actions';
import { createCompetition } from '../controllers/competition';
import { GlobalState } from '../globalState';
import { useStyles } from './commonStyles';
import { CompetitionDialog } from './competitionDialog';

export const CompetitionList: React.FC = () => {
  const styles = useStyles((theme: Theme) => ({
    root: css`
      & .MuiListItemButton-root {
        background-color: ${theme.palette.background.paper};
        border-bottom: 1px solid ${theme.palette.divider};
        border-radius: 5px;
        &:hover {
          background-color: ${theme.palette.primary.light};
        }
      }
    `,
  }));
  const [conList, compeDialog] = useSelector<
    GlobalState,
    [Competition[], GlobalState['competitionDialog']]
  >((a) => [a.competitionList, a.competitionDialog]);
  const rows = useMemo(() => {
    return conList.map((con) => {
      const secondary = `${dayjs(con.date).format('YYYY-MM-DD')} 開催場所: ${
        con.place
      } コース数: ${con.courseCount}`;
      return (
        <ListItemButton key={con.id} component={Link} to={`/scores/${con.id}`}>
          <ListItemText primary={con.title} secondary={secondary} />
        </ListItemButton>
      );
    });
  }, [conList]);
  const dispatch = useDispatch();
  const onClickNew = useCallback(() => {
    dispatch(
      setDialogForCompetition({ open: true, competition: createCompetition() }),
    );
  }, [dispatch]);
  const onCloseDialog = useCallback(() => {
    dispatch(setDialogForCompetition({ open: false }));
  }, [dispatch]);
  const onCommitCompeDialog = useCallback(
    (compe: Competition) => {
      dispatch(addCompetition(compe));
    },
    [dispatch],
  );
  return (
    <>
      <Typography variant="h4">最近のイベント</Typography>
      <Box>
        <Button data-testid="new-button" onClick={onClickNew}>
          新しいイベントを作る
        </Button>
      </Box>
      <List data-testid="con-list" css={styles.root}>
        {rows}
      </List>
      <CompetitionDialog
        data-testid="competition-dialog"
        onCommit={onCommitCompeDialog}
        onClose={onCloseDialog}
      />
    </>
  );
};
