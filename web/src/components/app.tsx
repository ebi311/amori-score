import { Container, css, useTheme } from '@mui/material';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useStyles } from './commonStyles';
import { CompetitionDialog } from './competitionDialog';
import { CompetitionList } from './competitionList';
import { PlayerList } from './playerList';

export const App: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles((theme) => ({
    drawerRoot: css`
      & .MuiListItemButton-root {
        background-color: ${theme.palette.primary.light};
        margin: 1rem 0;
        &:hover,
        &:active {
          background-color: ${theme.palette.primary.dark};
          color: ${theme.palette.primary.contrastText};
        }
      }
    `,
  }));
  return (
    <>
      <Container>
        <HashRouter>
          <Routes>
            <Route path="/" element={<CompetitionList />} />
            <Route path="/scores/:id" element={<PlayerList />} />
          </Routes>
        </HashRouter>
      </Container>
    </>
  );
};
