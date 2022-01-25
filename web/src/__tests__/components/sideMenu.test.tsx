import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SideMenu } from '../../components/sideMenu';
import { Competition } from '../../../../models/competition';
import { customRender as render } from './test-utils';

const competition: Competition = {
  id: '001',
  title: 'イベント００１',
  courseCount: 9,
  date: new Date(),
  note: '',
  place: '場所',
  scores: [],
};

test('プレイヤー追加ボタンクリック時の処理', async () => {
  const [{ getByTestId }, store] = render(
    <MemoryRouter>
      <SideMenu competition={competition} />
    </MemoryRouter>,
  );
  const addButton = getByTestId('add-player');
  expect(addButton).toBeTruthy();
  fireEvent.click(addButton);
  const state = store.getState();
  await waitFor(() => expect(state.playerDialog.open).toBe(true));
  expect(state.playerDialog.player).toEqual({ age: -1, name: '' });
});
test('順位をページに遷移するボタンクリック時の処理', () => {
  const [{ getByTestId, getByText }] = render(
    <MemoryRouter initialIndex={1}>
      <Routes>
        <Route path="/" element={<SideMenu competition={competition} />} />
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
        <Route path="/dummy" element={<SideMenu competition={competition} />} />
        <Route path="/" element={<div>Scores</div>} />
      </Routes>
    </MemoryRouter>,
  );
  const showRankingButton = getByTestId('show-scores');
  fireEvent.click(showRankingButton);
  expect(getByText('Scores')).toBeTruthy();
});

test('イベントを編集するボタンをクリックしたときの処理', () => {
  const [{ getByTestId }, store] = render(
    <MemoryRouter initialIndex={1}>
      <Routes>
        <Route path="/" element={<SideMenu competition={competition} />} />
        <Route path="/ranking" element={<div>Ranking</div>} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(getByTestId('edit-competition'));
  expect(store.getState().competitionDialog.open).toBe(true);
});
