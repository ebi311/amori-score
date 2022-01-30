import { Container } from '@mui/material';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CompetitionList } from './competitionList';
import { PlayerList } from './playerList';
import { Ranking } from './ranking';

export const App: React.FC = () => {
  return (
    <>
      <Container maxWidth="xl">
        <HashRouter>
          <Routes>
            <Route path="/" element={<CompetitionList />} />
            <Route path="/scores/:id" element={<PlayerList />} />
            <Route path="/ranking/:id" element={<Ranking />} />
          </Routes>
        </HashRouter>
      </Container>
    </>
  );
};
