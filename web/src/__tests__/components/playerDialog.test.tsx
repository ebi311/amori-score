/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import '@testing-library/jest-dom';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import { PlayerDialog } from '../../components/playerDialog';
import { Player } from '../../../../models/player';
import { customRender as render } from './test-utils';

const player1: Player = {
  name: 'プレイヤー１',
  age: 20,
};
const player2: Player = {
  name: 'プレイヤー２',
  age: 30,
};

test('open に false を渡すと、ダイアログを表示しない。', () => {
  const [{ queryByTestId }] = render(
    <PlayerDialog onCommit={() => undefined} onClose={() => undefined} />,
  );
  expect(!queryByTestId('player-dialog')).toBe(true);
});
test('open に true を渡すと、ダイアログを表示する。', () => {
  const [{ queryByTestId }] = render(
    <PlayerDialog onCommit={() => {}} onClose={() => undefined} />,
    { playerDialog: { open: true, player: player1 } },
  );
  expect(queryByTestId('player-dialog')).toBeTruthy();
});
test('プロパティで渡した Player の情報を表示する。', () => {
  [player1, player2].forEach((player) => {
    cleanup();
    const [{ getByTestId }] = render(
      <PlayerDialog onCommit={() => {}} onClose={() => undefined} />,
      { playerDialog: { open: true, player } },
    );
    const name = getByTestId('name-textbox').querySelector('input');
    expect(name?.value).toBe(player.name);
    const age = getByTestId('age-textbox').querySelector('input');
    expect(age?.value).toBe(player.age.toString());
  });
});
test('名前と年齢を変更する。', () => {
  const [{ getByTestId }] = render(
    <PlayerDialog onCommit={() => {}} onClose={() => undefined} />,
    { playerDialog: { open: true, player: player1 } },
  );
  let name = getByTestId('name-textbox').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(name, { target: { value: 'プレイヤ２' } });
  name = getByTestId('name-textbox').querySelector('input') as HTMLInputElement;
  expect(name.value).toBe('プレイヤ２');
  let age = getByTestId('age-textbox').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(age, { target: { value: '31' } });
  age = getByTestId('age-textbox').querySelector('input') as HTMLInputElement;
  expect(age.value).toBe('31');
  // 空にすると、内部では -1 を持つが、表示は空文字
  fireEvent.change(age, { target: { value: '' } });
  age = getByTestId('age-textbox').querySelector('input') as HTMLInputElement;
  expect(age.value).toBe('');
});
test('保存ボタンを押すと、プロパティの onCommit を実行する。', () => {
  const onChange = jest.fn((player: Player) => {
    expect(player.name).toBe('プレイヤ２');
    expect(player.age).toBe(31);
  });
  const [{ getByTestId }] = render(
    <PlayerDialog onCommit={onChange} onClose={() => undefined} />,
    { playerDialog: { open: true, player: player1 } },
  );
  let name = getByTestId('name-textbox').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(name, { target: { value: 'プレイヤ２' } });
  name = getByTestId('name-textbox').querySelector('input') as HTMLInputElement;
  let age = getByTestId('age-textbox').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(age, { target: { value: '31' } });
  age = getByTestId('age-textbox').querySelector('input') as HTMLInputElement;
  const saveButton = getByTestId('save-button');
  fireEvent.click(saveButton);
  expect(onChange).toBeCalled();
});
test('キャンセルボタンを押すと、プロパティの onClose を実行する。', () => {
  const onClose = jest.fn();
  const [{ getByTestId }] = render(
    <PlayerDialog onCommit={() => {}} onClose={onClose} />,
    { playerDialog: { open: true, player: player1 } },
  );
  const closeButton = getByTestId('cancel-button');
  fireEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
test('ESCキーを押すと、プロパティの onClose を実行する。', async () => {
  const onClose = jest.fn();
  const [{ getByTestId }] = render(
    <PlayerDialog onCommit={() => {}} onClose={onClose} />,
    { playerDialog: { open: true, player: player1 } },
  );
  const dialog = getByTestId('player-dialog');
  fireEvent.keyDown(dialog, { key: 'Esc' });
  await waitFor(() => expect(onClose).toBeCalled());
});
test('入力チェック', async () => {
  const onChange = jest.fn();
  const [{ getByTestId }] = render(
    <PlayerDialog onCommit={onChange} onClose={() => undefined} />,
    { playerDialog: { open: true, player: player1 } },
  );
  let name: HTMLElement = getByTestId('name-textbox');
  let age: HTMLElement = getByTestId('age-textbox');
  const reGetElements = () => {
    name = getByTestId('name-textbox');
    age = getByTestId('age-textbox');
  };
  const nameInput = name.querySelector('input') as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: '' } });
  const ageInput = age.querySelector('input') as HTMLInputElement;
  const saveButton = getByTestId('save-button');
  // 保存ボタンクリック 1
  fireEvent.click(saveButton);
  reGetElements();
  expect(onChange).not.toBeCalled();
  expect(name.querySelector('label')).toHaveStyle('color: rgb(211,47,47)');
  expect(age.querySelector('label')).toHaveStyle('color: rgba(0, 0, 0, 0.6)');
  //
  fireEvent.change(nameInput, { target: { value: 'test' } });
  fireEvent.change(ageInput, { target: { value: '' } });
  // 保存ボタンクリック 2
  fireEvent.click(saveButton);
  reGetElements();
  expect(onChange).not.toBeCalled();
  expect(name.querySelector('label')).toHaveStyle('color: rgba(0,0,0,0.6)');
  expect(age.querySelector('label')).toHaveStyle('color: rgb(211, 47, 47)');

  fireEvent.change(ageInput, { target: { value: '40' } });
  // 保存ボタンクリック 3
  fireEvent.click(saveButton);
  reGetElements();
  expect(onChange).toBeCalled();
  expect(name.querySelector('label')).toHaveStyle('color: rgba(0,0,0,0.6)');
  expect(age.querySelector('label')).toHaveStyle('color: rgba(0, 0, 0, 0.6)');
});
