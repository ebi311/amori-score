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
import { addConvention, setDialogForConvention } from '../actions/actions';
import { Convention, createConvention } from '../controllers/convention';
import { GlobalState } from '../globalState';
import { useStyles } from './commonStyles';
import { ConventionDialog } from './conventionDialog';

export const ConventionList: React.FC = () => {
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
  const [conList, convDialog] = useSelector<
    GlobalState,
    [Convention[], GlobalState['conventionDialog']]
  >((a) => [a.conventionList, a.conventionDialog]);
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
      setDialogForConvention({ open: true, convention: createConvention() }),
    );
  }, [dispatch]);
  const onCloseDialog = useCallback(() => {
    dispatch(setDialogForConvention({ open: false }));
  }, [dispatch]);
  const onCommitConvDialog = useCallback(
    (conv: Convention) => {
      dispatch(addConvention(conv));
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
      <ConventionDialog
        data-testid="convention-dialog"
        open={convDialog.open}
        onCommit={onCommitConvDialog}
        onClose={onCloseDialog}
        convention={convDialog.convention}
      />
    </>
  );
};
