import { Container } from '@mui/material';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CompetitionList } from './competitionList';
import { PlayerList } from './playerList';

export const App: React.FC = () => {
  return (
    <>
      <Container maxWidth="xl">
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
