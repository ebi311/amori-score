import { Player } from './player';

class ScoreImplements {
  private score: number[] = [];
  constructor(public player: Player) {}
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
    let ret = myTotal < targetTotal ? 1 : myTotal === targetTotal ? 0 : -1;
    if (ret !== 0) return ret;
    // スコアの合計が同じ場合は、少ないスコアのコースが多いほうが上位
    ret = this.compareScoreCount(target);
    if (ret !== 0) return ret;
    // 上も同位の場合、年齢が上の方が上位
    return this.player.age < target.player.age
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
      .sort((a, b) => (a < b ? -1 : 1));
    return uniqueIndexes;
  }
  scoreCount(score: number) {
    const a = this.score.filter((a) => a === score);
    return a.length;
  }
  private compareScoreCount(target: Score) {
    const scoreList = this.combinedScore(target);
    let ret = 0;
    scoreList.some((score) => {
      const myCount = this.scoreCount(score);
      const targetCount = target.scoreCount(score);
      ret = myCount > targetCount ? 1 : myCount === targetCount ? 0 : -1;
      return ret !== 0;
    });
    return ret;
  }
}

export type Score = ScoreImplements;

export const createScore = (player: Player) => new ScoreImplements(player);
