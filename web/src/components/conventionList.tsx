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
import { setOpenDialogForConvention } from '../actions/actions';
import { Convention } from '../controllers/convention';
import { GlobalState } from '../globalState';
import { useStyles } from './commonStyles';

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
  const conList = useSelector<GlobalState, Convention[]>(
    (a) => a.conventionList,
  );
  const rows = useMemo(() => {
    return conList.map((con) => {
      const secondary = `${dayjs(con.date).format('YYYY-MM-DD')} 開催場所: ${
        con.place
      }`;
      return (
        <ListItemButton key={con.id} component={Link} to={`/scores/${con.id}`}>
          <ListItemText primary={con.title} secondary={secondary} />
        </ListItemButton>
      );
    });
  }, [conList]);
  const dispatch = useDispatch();
  const onClickNew = useCallback(() => {
    dispatch(setOpenDialogForConvention(true));
  }, [dispatch]);
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
    </>
  );
};
