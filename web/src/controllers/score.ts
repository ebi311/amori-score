import { DiffRes, Player, Score } from '@amori-score/models';
import { nanoid } from 'nanoid';

export type ScoreData = {
  _id: string;
  _player: Player;
  _score: number[];
};
class ScoreImplements implements Score {
  private _id = nanoid();
  public get id() {
    return this._id;
  }
  private _player: Player;
  public get player() {
    return this._player;
  }
  private _score: number[] = [];
  public get score() {
    return this._score;
  }
  constructor(arg: ScoreData | Player) {
    if ('_id' in arg) {
      this._id = arg._id;
      this._player = arg._player;
      this._score = arg._score;
    } else {
      this._player = arg;
    }
  }
  set(course: number, score: number) {
    this.score[course] = score;
  }
  get(course: number) {
    return this.score[course];
  }
  total() {
    return this.score.reduce((a, b) => a + b, 0);
  }
  compare(target: Score) {
    const myTotal = this.total();
    const targetTotal = target.total();
    let ret: DiffRes =
      myTotal < targetTotal ? -1 : myTotal === targetTotal ? 0 : 1;
    if (ret !== 0) return ret;
    // スコアの合計が同じ場合は、少ないスコアのコースが多いほうが上位
    ret = this.compareScoreCount(target);
    if (ret !== 0) return ret;
    // 上も同位の場合、年齢が上の方が上位
    return this.player.age > target.player.age
      ? -1
      : this.player.age === target.player.age
      ? 0
      : 1;
  }
  private combinedScore(target: Score) {
    const indexes = [...this.score];
    const targetIndexes = [...target.score];
    const mergeIndexes = [...indexes, ...targetIndexes];
    const uniqueIndexes = Array.from(new Set(mergeIndexes))
      .filter((a) => !!a)
      .sort((a, b) => (a < b ? -1 : a == b ? 0 : 1));
    return uniqueIndexes;
  }
  scoreCount(score: number) {
    const a = this.score.filter((a) => a === score);
    return a.length;
  }
  private compareScoreCount(target: Score) {
    const scoreList = this.combinedScore(target);
    let ret: DiffRes = 0;
    scoreList.some((score) => {
      const myCount = this.scoreCount(score);
      const targetCount = target.scoreCount(score);
      ret = myCount > targetCount ? -1 : myCount === targetCount ? 0 : 1;
      return ret !== 0;
    });
    return ret;
  }
}

export const createScore = (player: Player | ScoreData): Score =>
  new ScoreImplements(player);
