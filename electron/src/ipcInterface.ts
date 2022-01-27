import * as fs from 'fs-extra';
import path from 'path';
import { Competition } from '@amori-score/models';

const dataPath = path.join(__dirname, '../data.json');

export const ipcMainInterface = {
  loadData: async () => {
    if (fs.existsSync(dataPath)) {
      return fs.readJson(dataPath, {
        reviver: (key: string, value: unknown) => {
          if (typeof value !== 'string') return value;
          if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
            return new Date(value);
          } else {
            return value;
          }
        },
      });
    } else {
      return fs.writeJson(dataPath, []).then(() => {
        return [];
      });
    }
  },
  saveData: async (_e: unknown, data: Competition[]) => {
    return fs.writeJSON(dataPath, data, { encoding: 'utf-8' });
  },
};
