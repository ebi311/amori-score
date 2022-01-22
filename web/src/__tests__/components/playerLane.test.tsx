import { fireEvent, waitFor } from '@testing-library/react';
import { mocked } from 'jest-mock';
import nanoid from 'nanoid';
import React from 'react';
import { PlayerLane } from '../../components/playerLane';
import { createScore, Score } from '../../controllers/score';
import { GlobalState } from '../../globalState';
import { customRender as render } from './test-utils';

function* mockNanoid() {
  let i = 0;
  while (true) {
    yield i.toString().padStart(6, '0');
    i++;
  }
}
const y = mockNanoid();
jest.mock('nanoid');
mocked(nanoid).nanoid.mockReturnValue(y.next().value || '');

const makeScore = () => {
  const score = createScore({
    name: 'プレイヤー1',
    age: 20,
  });
  score.set(1, 1);
  score.set(2, 3);
  score.set(9, 5);
  return score;
};

const pState: Partial<GlobalState> = {
  competitionList: [
    {
      id: 'compe001',
      courseCount: 9,
      date: new Date(),
      note: '',
      place: '',
      scores: [makeScore()],
      title: '',
    },
  ],
};

test('プレイヤーの行を表示する', () => {
  const score = makeScore();
  const [{ getByText, getAllByTestId, getByTestId }] = render(
    <PlayerLane
      competitionId="compe001"
      scoreId="000000"
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={jest.fn()}
    />,
    pState,
  );
  expect(!!getByText(/プレイヤー1/)).toBeTruthy();
  expect(!!getByText(/20歳/)).toBeTruthy();
  // スコアを表示するセルがコースの数だけ 表示されている
  const cells = getAllByTestId(/^000000-course-/);
  expect(cells.length).toBe(9);
  // スコアが表示されている
  const cell1 = getByTestId('000000-course-1') as HTMLInputElement;
  expect(cell1.value).toBe('1');
  const cell2 = getByTestId('000000-course-2') as HTMLInputElement;
  expect(cell2.value).toBe('3');
  const cell9 = getByTestId('000000-course-9') as HTMLInputElement;
  expect(cell9.value).toBe('5');
  // 合計が表示されている
  const total = getByTestId('total');
  expect(total.textContent).toBe('9');
});

test('スコアを変更したらコールバック関数を実行する', () => {
  const score = makeScore();
  const cb = jest.fn().mockImplementation((_score: Score, index: number) => {
    expect(_score.get(3)).toBe(1);
    expect(_score).not.toBe(score);
    expect(index).toBe(0);
  });
  const [{ getByTestId }, store] = render(
    <PlayerLane
      competitionId="compe001"
      scoreId="000000"
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={jest.fn()}
    />,
    pState,
  );
  const input = getByTestId('000000-course-3') as HTMLInputElement;
  fireEvent.change(input, { target: { value: '6' } });
  const cell3 = getByTestId('000000-course-3') as HTMLInputElement;
  waitFor(() => expect(cell3.value).toBe('6'));
  expect(store.getState().competitionList[0].scores[0].get(3)).toBe(6);
});

test('プレイヤーを編集する。', () => {
  const onOpenEditPlayer = jest.fn();
  const score = makeScore();
  const [{ getByTestId }] = render(
    <PlayerLane
      competitionId="compe001"
      scoreId="000000"
      onOpenEditPlayer={onOpenEditPlayer}
      onDeletePlayer={onOpenEditPlayer}
    />,
    pState,
  );
  fireEvent.click(getByTestId('edit-player'));
  expect(onOpenEditPlayer).toBeCalled();
});
test('プレイヤーを削除する。', () => {
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  const score = makeScore();
  const onDeletePlayer = jest.fn();
  const [{ getByTestId }] = render(
    <PlayerLane
      competitionId="compe001"
      scoreId="000000"
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={onDeletePlayer}
    />,
    pState,
  );
  fireEvent.click(getByTestId('delete-player'));
  expect(onDeletePlayer).toBeCalled();
});
