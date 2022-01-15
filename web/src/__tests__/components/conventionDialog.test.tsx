/* eslint-disable react/react-in-jsx-scope */
import { fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import { ConventionDialog } from '../../components/conventionDialog';
import { Convention } from '../../controllers/convention';
import { customRender as _render } from './test-utils';

let onClose: jest.Mock;
let onCommit: jest.Mock;
const render = (open = true) => {
  onClose = jest.fn();
  onCommit = jest.fn();
  return _render(
    <ConventionDialog
      open={open}
      convention={{
        title: 'イベント01',
        date: new Date('2022-01-01T00:00:00Z'),
        id: '001',
        note: '備考1',
        place: '場所1',
      }}
      onClose={onClose}
      onCommit={onCommit}
    />,
  );
};

test('フォームに値を表示する', () => {
  const [{ getByTestId }] = render();
  const titleInput = getByTestId('title-input').querySelector(
    'input',
  ) as HTMLInputElement;
  expect(titleInput.value).toBe('イベント01');
  const dateInput = getByTestId('date-input').querySelector(
    'input',
  ) as HTMLInputElement;
  expect(dateInput.value).toBe('2022-01-01');
  const placeInput = getByTestId('place-input').querySelector(
    'input',
  ) as HTMLInputElement;
  expect(placeInput.value).toBe('場所1');
});
test('フォームの値を変更する', () => {
  const [{ getByTestId }] = render();
  let titleInput = getByTestId('title-input').querySelector(
    'input',
  ) as HTMLInputElement;
  let dateInput = getByTestId('date-input').querySelector(
    'input',
  ) as HTMLInputElement;
  let placeInput = getByTestId('place-input').querySelector(
    'input',
  ) as HTMLInputElement;
  const reGetElements = () => {
    titleInput = getByTestId('title-input').querySelector(
      'input',
    ) as HTMLInputElement;
    dateInput = getByTestId('date-input').querySelector(
      'input',
    ) as HTMLInputElement;
    placeInput = getByTestId('place-input').querySelector(
      'input',
    ) as HTMLInputElement;
  };
  fireEvent.change(titleInput, { target: { value: 'イベント02' } });
  fireEvent.change(placeInput, { target: { value: '場所002' } });
  fireEvent.change(dateInput, { target: { value: '2022-01-02' } });
  reGetElements();
  expect(titleInput.value).toBe('イベント02');
  expect(placeInput.value).toBe('場所002');
  expect(dateInput.value).toBe('2022-01-02');
});
test('登録ボタンを押す', () => {
  const [{ getByTestId }] = render();

  const titleInput = getByTestId('title-input').querySelector(
    'input',
  ) as HTMLInputElement;
  const dateInput = getByTestId('date-input').querySelector(
    'input',
  ) as HTMLInputElement;
  const placeInput = getByTestId('place-input').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(titleInput, { target: { value: 'イベント02' } });
  fireEvent.change(placeInput, { target: { value: '場所002' } });
  fireEvent.change(dateInput, { target: { value: '2022-01-02' } });

  const commitButton = getByTestId('commit-button');
  fireEvent.click(commitButton);
  expect(onCommit).toBeCalledWith({
    title: 'イベント02',
    place: '場所002',
    id: '001',
    note: '備考1',
    date: dayjs('2022-01-02').toDate(),
  });
});
test.todo('入力チェック');
test('キャンセルボタンを押す', () => {
  const [{ getByTestId }] = render();
  const cancelButton = getByTestId('cancel-button');
  fireEvent.click(cancelButton);
  expect(onClose).toBeCalled();
});
test('ダイアログを閉じる', () => {
  const [{ queryByTestId }] = render(false);
  const container = queryByTestId('container');
  expect(container).toBeFalsy();
});
