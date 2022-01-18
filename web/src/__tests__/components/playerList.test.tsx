import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { PlayerList } from '../../components/playerList';
import { createScore } from '../../controllers/score';
import { customRender as _render } from './test-utils';

const testData = (count = 5, prefix = '') => {
  return [...Array(count)].map((_, i) => {
    return createScore({
      name: `${prefix}プレイヤー${i}`,
      age: 20 + i,
    });
  });
};
const render = (id = '001') =>
  _render(
    <MemoryRouter initialEntries={[`/${id}`]}>
      <Routes>
        <Route path="/:id" element={<PlayerList />} />
      </Routes>
    </MemoryRouter>,
    {
      conventionList: [
        {
          id: '001',
          note: '備考',
          place: '場所',
          title: 'イベント００１',
          date: new Date('2022-01-01T00:00:00+0900'),
          scores: testData(5),
          courseCount: 9,
        },
        {
          id: '002',
          note: '備考002',
          place: '場所002',
          title: 'イベント００２',
          date: new Date('2022-01-02T00:00:00+0900'),
          scores: testData(6),
          courseCount: 9,
        },
      ],
    },
  );
test('ステートのリストを表示する', () => {
  const [{ getAllByTestId, getByText }] = render();
  expect(getAllByTestId(/score-row-/).length).toBe(5);
  [...Array(5)].forEach((_, i) => {
    expect(getByText(new RegExp(`プレイヤー${i}`))).toBeTruthy();
  });
});

test('スコアを変更したら反映する', async () => {
  const [{ getByTestId }] = render();
  const input = getByTestId('0-course-1');
  fireEvent.change(input, { target: { value: '1' } });
  await waitFor(() => {
    const input = getByTestId('0-course-1') as HTMLInputElement;
    return expect(input.value).toBe('1');
  });
});
test('パスパラメータに応じて、データを切り替える', () => {
  const [{ getByTestId }] = render('002');
  const rows = getByTestId('rows');
  expect(rows.childNodes.length).toBe(6);
});
