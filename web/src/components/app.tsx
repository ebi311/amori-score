import { Container, css, useTheme } from '@mui/material';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useStyles } from './commonStyles';
import { ConventionDialog } from './conventionDialog';
import { ConventionList } from './conventionList';
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
      <HashRouter>
        <Container>
          <Routes>
            <Route path="/" element={<ConventionList />} />
            <Route path="/scores/:id" element={<PlayerList />} />
          </Routes>
        </Container>
        <ConventionDialog
          open={true}
          convention={{
            title: 'イベント01',
            date: new Date('2022-01-01T00:00:00Z'),
            id: '001',
            note: '備考1',
            place: '場所1',
          }}
          onClose={() => ''}
          onCommit={() => ''}
        />
      </HashRouter>
    </>
  );
};