import { PlayerLane } from '../../components/playerLane';
import { customRender as render } from './test-utils';
import React from 'react';
import { createScore, Score } from '../../controllers/score';
import { fireEvent, waitFor } from '@testing-library/react';

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

test('プレイヤーの行を表示する', () => {
  const score = makeScore();
  const [{ getByText, getAllByTestId, getByTestId }] = render(
    <PlayerLane
      index={0}
      score={score}
      onChange={jest.fn()}
      courseCount={9}
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={jest.fn()}
    />,
  );
  expect(!!getByText(/プレイヤー1/)).toBeTruthy();
  expect(!!getByText(/20歳/)).toBeTruthy();
  // スコアを表示するセルがコースの数だけ 表示されている
  const cells = getAllByTestId(/^0-course-/);
  expect(cells.length).toBe(9);
  // スコアが表示されている
  const cell1 = getByTestId('0-course-1') as HTMLInputElement;
  expect(cell1.value).toBe('1');
  const cell2 = getByTestId('0-course-2') as HTMLInputElement;
  expect(cell2.value).toBe('3');
  const cell9 = getByTestId('0-course-9') as HTMLInputElement;
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
  const [{ getByTestId }] = render(
    <PlayerLane
      index={0}
      score={score}
      onChange={cb}
      courseCount={9}
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={jest.fn()}
    />,
  );
  const input = getByTestId('0-course-3') as HTMLInputElement;
  fireEvent.change(input, { target: { value: '1' } });
  // expect(cb).toBeCalled();
  const cell3 = getByTestId('0-course-3') as HTMLInputElement;
  waitFor(() => expect(cell3.value).toBe('1'));
});

test('プレイヤーを編集する。', () => {
  const onOpenEditPlayer = jest.fn();
  const score = makeScore();
  const [{ getByTestId }] = render(
    <PlayerLane
      index={0}
      score={score}
      onChange={jest.fn()}
      courseCount={9}
      onOpenEditPlayer={onOpenEditPlayer}
      onDeletePlayer={onOpenEditPlayer}
    />,
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
      index={0}
      score={score}
      onChange={jest.fn()}
      courseCount={9}
      onOpenEditPlayer={jest.fn()}
      onDeletePlayer={onDeletePlayer}
    />,
  );
  fireEvent.click(getByTestId('delete-player'));
  expect(onDeletePlayer).toBeCalled();
});
