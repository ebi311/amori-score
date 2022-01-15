/* eslint-disable react/react-in-jsx-scope */
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { ConventionList } from '../../components/conventionList';
import { Convention } from '../../controllers/convention';
import { customRender as _render } from './test-utils';
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
test('新しいイベントを作成する', () => {
  const [{ getByTestId }, store] = render();
  const newButton = getByTestId('new-button');
  fireEvent.click(newButton);
  expect(store.getState().openConventionDialog).toBe(true);
});
test('既存のイベントを開く', () => {
  const [{ getByTestId }] = render();
  const row = getByTestId('con-list').childNodes[0] as HTMLElement;
  fireEvent.click(row);
  expect(getByTestId('id').textContent).toBe('000');
});
