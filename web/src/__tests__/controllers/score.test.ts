/** TODO
 * o スコアを追加する
 *   o 同じコースのスコアを上書きする
 * o スコアを取得する
 * o スコアの合計を取得する
 *   o スコアが１つもない場合は、0を返す
 * o 合計スコアを比較する
 *   o 比較対象が大きい場合は、'1', 同じ場合は '0', 小さい場合は '-1' を返す
 *   o 合計スコアが同じ場合は、小さいスコアが多いほうが 上位（小さい）、と判断する
 *   o 上も同じ場合は、プレイヤーの年齢の大きいほうが 上位（小さい）、と判断する
 */
import { Player } from '../../controllers/player';
import { createScore, Score } from '../../controllers/score';
const player10: Player = {
  name: 'player10',
  age: 10,
};
const player11: Player = {
  name: 'player11',
  age: 11,
};
describe('スコアを追加する', () => {
  test('通常', () => {
    const score = createScore(player10);
    score.set(1, 3);
    expect(score.get(1)).toBe(3);
  });
  test('スコアを上書きする', () => {
    const score = createScore(player10);
    score.set(1, 3);
    score.set(1, 4);
    expect(score.get(1)).toBe(4);
  });
});

describe('スコアの合計を取得する', () => {
  test('通常', () => {
    const score = createScore(player10);
    score.set(1, 3);
    score.set(2, 5);
    expect(score.total()).toBe(8);
  });
  test('スコアがない場合 0 を返す', () => {
    const score = createScore(player10);
    expect(score.total()).toBe(0);
  });
});

describe('スコアを比較する', () => {
  let score: Score;
  let targetScore1: Score;
  let targetScore2: Score;
  let targetScore3: Score;
  let targetScore4: Score;
  beforeEach(() => {
    score = createScore(player10);
    score.set(1, 2);
    score.set(2, 1);
    score.set(3, 1);
    score.set(4, 3);
    score.set(5, 5);
    targetScore1 = createScore(player10);
    targetScore1.set(1, 2);
    targetScore1.set(2, 2);
    targetScore1.set(3, 1);
    targetScore1.set(4, 3);
    targetScore1.set(5, 5);
    targetScore2 = createScore(player11);
    targetScore2.set(1, 4);
    targetScore2.set(2, 1);
    targetScore2.set(3, 1);
    targetScore2.set(4, 1);
    targetScore2.set(5, 5);
    targetScore3 = createScore(player11);
    targetScore3.set(1, 3);
    targetScore3.set(2, 2);
    targetScore3.set(3, 1);
    targetScore3.set(4, 1);
    targetScore3.set(5, 5);
    targetScore4 = createScore(player11);
    targetScore4.set(1, 6);
    targetScore4.set(2, 2);
    targetScore4.set(3, 1);
    targetScore4.set(4, 1);
    targetScore4.set(5, 2);
  });
  test('対象のスコアの合計が小さい場合、"1", 大きい場合 "-1', () => {
    expect(score.compare(targetScore1)).toBe(1);
    targetScore1.set(2, 1);
    expect(score.compare(targetScore1)).toBe(0);
    targetScore1.set(1, 1);
    expect(score.compare(targetScore1)).toBe(-1);
  });
  test('合計が同数の場合、小さいスコアの数で決める', () => {
    expect(score.compare(targetScore2)).toBe(-1);
    expect(score.compare(targetScore4)).toBe(-1);
    targetScore4.set(1, 4);
    targetScore4.set(2, 4);
    expect(score.compare(targetScore4)).toBe(1);
  });
  test('合計もスコア数も同じ場合、年齢で決まる', () => {
    expect(score.compare(targetScore3)).toBe(-1);
  });

  test('スコアのカウント用にスコアをマージしてユニークな配列を作成する', () => {
    const courseList1 = score['combinedScore'](targetScore1);
    expect(courseList1).toEqual([1, 2, 3, 5]);
    const courseList2 = score['combinedScore'](targetScore2);
    expect(courseList2).toEqual([1, 2, 3, 4, 5]);
  });

  test('スコアの数を比較する', () => {
    expect(score['scoreCount'](1)).toBe(2);
    expect(score['scoreCount'](2)).toBe(1);
    // 1のスコアを比較する
    expect(score['compareScoreCount'](targetScore1)).toBe(1);
    expect(score['compareScoreCount'](targetScore2)).toBe(-1);
    expect(score['compareScoreCount'](targetScore3)).toBe(0);
    // 1 が同数であれば、2のスコアの数を比較する
    expect(score['compareScoreCount'](targetScore4)).toBe(-1);
    targetScore4.set(1, 4);
    targetScore4.set(2, 4);
    expect(score['compareScoreCount'](targetScore4)).toBe(1);
  });
});
