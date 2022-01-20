import { fireEvent, queryByTestId, waitFor } from '@testing-library/react';
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
      competitionList: [
        {
          id: '001',
          note: '備考',
          place: '場所001',
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
  const [{ getAllByTestId, getByText, getByTestId }] = render();
  expect(getByTestId('title').textContent).toBe('イベント００１');
  expect(getByTestId('subtitle').textContent).toBe(
    '2022年1月1日 開催場所： 場所001',
  );
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
test('プレイヤーを登録する', async () => {
  const [{ getByTestId, queryByTestId, queryAllByTestId }] = render();
  expect(queryAllByTestId(/score-row-/).length).toBe(5);
  fireEvent.click(getByTestId('add-player'));
  expect(queryByTestId('player-dialog')).toBeTruthy();
  fireEvent.change(getByTestId('name-input'), {
    target: { value: 'プレイヤー９' },
  });
  fireEvent.change(getByTestId('age-input'), { target: { value: '50' } });
  fireEvent.click(getByTestId('save-button'));
  await waitFor(() => expect(queryByTestId('player-dialog')).toBeFalsy());
  // プレイヤーが増えている
  expect(queryAllByTestId(/score-row-/).length).toBe(6);
  // 再度開くと、テキストボックスがクリアされていること。
  fireEvent.click(getByTestId('add-player'));
  expect((getByTestId('name-input') as HTMLInputElement).value).toBe('');
});
test('プレイヤーダイアログを、キャンセルボタンで閉じる', async () => {
  const [{ getByTestId, queryByTestId, queryAllByTestId }] = render();
  expect(queryAllByTestId(/score-row-/).length).toBe(5);
  fireEvent.click(getByTestId('add-player'));
  await waitFor(() => expect(queryByTestId('player-dialog')).toBeTruthy());
  fireEvent.click(getByTestId('cancel-button'));
  await waitFor(() => expect(queryByTestId('player-dialog')).toBeFalsy());
});

test.todo('プレイヤーを編集する。');
test.todo('プレイヤーを削除する。');

test('イベントを編集する', async () => {
  const [{ getByTestId }] = render();
  fireEvent.click(getByTestId('edit-competition'));
  expect(
    (getByTestId('title-input').querySelector('input') as HTMLInputElement)
      .value,
  ).toBe('イベント００１');
  fireEvent.change(
    getByTestId('title-input').querySelector('input') as HTMLInputElement,
    { target: { value: 'イベント００２' } },
  );
  fireEvent.click(getByTestId('commit-button'));
  await waitFor(() =>
    expect(getByTestId('title').textContent).toBe('イベント００２'),
  );
});
test.todo('イベントを削除する');
