import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { PlayerList } from '../../components/playerList';
import { createScore } from '../../controllers/score';
import { customRender as render } from './test-utils';

const testData = () => {
  return [...Array(5)].map((_, i) => {
    return createScore({
      name: `プレイヤー${i}`,
      age: 20 + i,
    });
  });
};

test('ステートのリストを表示する', () => {
  const scores = testData();
  const [{ getAllByTestId, getByText }] = render(<PlayerList />, {
    scores: scores,
    courseCount: 9,
    eventName: 'テスト・イベント',
    openPlayerDialog: false,
  });
  expect(getAllByTestId(/score-row-/).length).toBe(5);
  [...Array(5)].forEach((_, i) => {
    expect(getByText(new RegExp(`プレイヤー${i}`))).toBeTruthy();
  });
});

test('スコアを変更したら反映する', async () => {
  const scores = testData();
  const [{ getByTestId }] = render(<PlayerList />, {
    scores: scores,
    courseCount: 9,
    eventName: 'テスト・イベント',
    openPlayerDialog: false,
  });
  const input = getByTestId('0-course-1');
  fireEvent.change(input, { target: { value: '1' } });
  await waitFor(() => {
    const input = getByTestId('0-course-1') as HTMLInputElement;
    return expect(input.value).toBe('1');
  });
});
