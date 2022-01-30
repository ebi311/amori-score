/* eslint-disable react/react-in-jsx-scope */
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Ranking } from '../../components/ranking';
import { createScore } from '../../controllers/score';
import { customRender as render } from './test-utils';

const testData = (count = 5, prefix = '') => {
  return [...Array(count)].map((_, i) => {
    return createScore({
      name: `${prefix}プレイヤー${i}`,
      age: 20 + i,
    });
  });
};

test('ランキングを表示する', () => {
  const scores = testData(6);
  (scores[0] as any)['_score'] = [null, 1, 1, 1, 3];
  (scores[1] as any)['_score'] = [null, 1, 1, 2, 2];
  (scores[2] as any)['_score'] = [null, 1, 1, 1, 3];
  (scores[3] as any)['_score'] = [null, 1, 2, 2, 2];
  (scores[4] as any)['_score'] = [null, 1, 2, 2, 2];
  (scores[5] as any)['_score'] = [null, 2, 2, 2, 2];
  scores[4].player.age = 23;
  const [{ getAllByTestId }] = render(
    <MemoryRouter initialEntries={['/001']}>
      <Routes>
        <Route path="/:id" element={<Ranking />} />
      </Routes>
    </MemoryRouter>,
    {
      competitionList: [
        {
          id: '001',
          courseCount: 4,
          date: new Date(),
          note: '',
          place: '',
          scores: scores,
          title: 'イベント001',
        },
      ],
    },
  );
  const rankRows = getAllByTestId(/^rank-row-/);
  expect(rankRows.length).toBe(6);
  const expectOrder = [2, 0, 1, 3, 4, 5];
  const expectRanking = [1, 2, 3, 4, 4, 6];
  rankRows.forEach((r, i) => {
    expect(r.textContent).toMatch(
      new RegExp(`${expectRanking[i]}位 プレイヤー${expectOrder[i]}`),
    );
  });
});
