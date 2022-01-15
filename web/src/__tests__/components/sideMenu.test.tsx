import { SideMenu } from '../../components/sideMenu';
import { customRender as render } from './test-utils';
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom';

test('プレイヤー追加ボタンクリック時の処理', async () => {
  const [{ getByTestId }, store] = render(
    <MemoryRouter>
      <SideMenu />
    </MemoryRouter>,
  );
  const addButton = getByTestId('add-player');
  expect(addButton).toBeTruthy();
  fireEvent.click(addButton);
  const state = store.getState();
  await waitFor(() => expect(state.openPlayerDialog).toBe(true));
});
test('順位をページに遷移するボタンクリック時の処理', () => {
  const [{ getByTestId, getByText }] = render(
    <MemoryRouter initialIndex={1}>
      <Routes>
        <Route path="/" element={<SideMenu />} />
        <Route path="/ranking" element={<div>Ranking</div>} />
      </Routes>
    </MemoryRouter>,
  );
  const showRankingButton = getByTestId('show-ranking');
  fireEvent.click(showRankingButton);
  expect(getByText('Ranking')).toBeTruthy();
});
test('スコアページに遷移するボタンクリック時の処理', () => {
  const [{ getByTestId, getByText }] = render(
    <MemoryRouter initialEntries={['/dummy']}>
      <Routes>
        <Route path="/dummy" element={<SideMenu />} />
        <Route path="/" element={<div>Scores</div>} />
      </Routes>
    </MemoryRouter>,
  );
  const showRankingButton = getByTestId('show-scores');
  fireEvent.click(showRankingButton);
  expect(getByText('Scores')).toBeTruthy();
});
