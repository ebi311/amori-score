/* eslint-disable react/react-in-jsx-scope */
import * as testing from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { ConventionList } from '../../components/conventionList';
import { Convention } from '../../controllers/convention';
import { customRender as _render } from './test-utils';
import { mocked } from 'jest-mock';
import nanoid from 'nanoid';

jest.mock('nanoid');
mocked(nanoid).nanoid.mockReturnValue('a001');

const DummyScore = () => {
  const params = useParams();
  return <div data-testid="id">{params.id}</div>;
};
const conventions: Convention[] = [...Array(3)].map((_, i) => ({
  id: i.toString().padStart(3, '0'),
  title: `イベント${i}`,
  date: new Date(`2022-01-1${i}T00:00:00Z`),
  note: `びこう${i}`,
  place: `場所${i}`,
  scores: [],
  courseCount: 9,
}));

const render = () =>
  _render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ConventionList />} />
        <Route path="/scores/:id" element={<DummyScore />} />
      </Routes>
    </MemoryRouter>,
    {
      conventionList: conventions,
    },
  );
test('イベントの一覧を表示する', () => {
  const [{ getByTestId }] = render();
  const conList = getByTestId('con-list');
  expect(conList.childNodes.length).toBe(3);
  [...Array(3)].map((_, i) => {
    const child = conList.childNodes[i] as HTMLElement;
    const primary = child.querySelector('.MuiListItemText-primary');
    const secondary = child.querySelector('.MuiListItemText-secondary');
    expect(primary?.textContent).toBe(`イベント${i}`);
    expect(secondary?.textContent).toBe(`2022-01-1${i} 開催場所: 場所${i}`);
  });
});
test('新しいイベントを作成する', async () => {
  const [{ getByTestId }, store] = render();
  const newButton = getByTestId('new-button');
  fireEvent.click(newButton);
  expect(store.getState().conventionDialog.open).toBe(true);
  // ダイアログの表示確認
  const dialog = getByTestId('convention-dialog');
  const titleTextField = dialog.querySelector(
    '[data-id=title]',
  ) as HTMLInputElement;
  expect(titleTextField?.value).toBe('');
  const datePicker = getByTestId('date-input')?.querySelector(
    'input',
  ) as HTMLInputElement;
  expect(datePicker?.value).toBe('2022/01/02');
  const placeTextField = dialog.querySelector(
    '[data-id=place]',
  ) as HTMLInputElement;
  expect(placeTextField?.value).toBe('');
  // ダイアログの入力
  fireEvent.change(titleTextField, { target: { value: 'イベント９９' } });
  fireEvent.change(datePicker, { target: { value: '2022/02/01' } });
  fireEvent.change(placeTextField, { target: { value: '吉野公園' } });
  const commitButton = testing.getByTestId(dialog, 'commit-button');
  fireEvent.click(commitButton);
  // 再度 新規作成ボタンを押したら、空で表示する
  fireEvent.click(getByTestId('new-button'));
  expect(getByTestId('title-input').querySelector('input')?.value).toBe('');
  fireEvent.keyPress(dialog, { key: 'Esc' });
  // 登録後表示の確認
  const conList = getByTestId('con-list');
  expect(conList.childNodes.length).toBe(4);
  expect(conList.childNodes[3].textContent).toBe(
    'イベント９９2022-02-01 開催場所: 吉野公園',
  );
  fireEvent.click(conList.childNodes[3]);
  expect(getByTestId('id').textContent).toBe('a001');
});
test('既存のイベントを開く', () => {
  const [{ getByTestId }] = render();
  const row = getByTestId('con-list').childNodes[0] as HTMLElement;
  fireEvent.click(row);
  expect(getByTestId('id').textContent).toBe('000');
});
