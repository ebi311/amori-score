import { Player } from './player';

export type DiffRes = 0 | 1 | -1;

export interface Score {
  get id(): string;
  set(course: number, score: number): void;
  get(course: number): number;
  total(): number;
  compare(target: Score): DiffRes;
  scoreCount(score: number): number;
  readonly player: Player;
  readonly score: number[];
}
