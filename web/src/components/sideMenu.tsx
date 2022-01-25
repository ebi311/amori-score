import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  css,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setDialogForCompetition,
  setDialogForPlayer,
} from '../actions/actions';
import { Competition } from '../../../models/competition';

type Props = {
  competition: Competition;
};

const iconCss = css`
  min-width: 2rem;
`;

export const SideMenu: React.FC<Props> = (props) => {
  const { competition } = props;
  const dispatch = useDispatch();
  const clickAddPlayer = useCallback(() => {
    dispatch(
      setDialogForPlayer({
        open: true,
        player: {
          age: -1,
          name: '',
        },
      }),
    );
  }, [dispatch]);
  const clickEditCompetition = useCallback(() => {
    dispatch(setDialogForCompetition({ open: true, competition }));
  }, [competition, dispatch]);

  return (
    <List>
      <ListItemButton data-testid="add-player" onClick={clickAddPlayer}>
        <ListItemIcon css={iconCss}>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="参加者を追加する" />
      </ListItemButton>
      <ListItemButton component={Link} to="/ranking" data-testid="show-ranking">
        <ListItemIcon css={iconCss}>
          <MilitaryTechIcon />
        </ListItemIcon>
        <ListItemText primary="順位を表示する" />
      </ListItemButton>
      <ListItemButton component={Link} to="/" data-testid="show-scores">
        <ListItemIcon css={iconCss}>
          <ViewListIcon />
        </ListItemIcon>
        <ListItemText primary="スコアを表示する" />
      </ListItemButton>
      <Divider />
      <ListItemButton
        data-testid="edit-competition"
        onClick={clickEditCompetition}
      >
        <ListItemIcon css={iconCss}>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="イベント名などを変更する" />
      </ListItemButton>
    </List>
  );
};
