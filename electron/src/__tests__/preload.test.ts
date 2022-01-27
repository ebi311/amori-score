import { ipcMainInterface } from '../ipcInterface';
import * as fs from 'fs-extra';
import path from 'path';
import { Competition } from '../../../models/competition';
import { ipcMain } from 'electron';

const dataPath = path.join(__dirname, '../../data.json');
const _dataPath = path.join(__dirname, '../../_data.json');

beforeEach(() => {
  if (fs.existsSync(_dataPath)) {
    fs.copyFileSync(_dataPath, dataPath);
  }
});

afterAll(() => {
  if (fs.existsSync(dataPath)) {
    fs.removeSync(dataPath);
  }
});

describe('データの読み込み', () => {
  test('データ有り', async () => {
    const data = await ipcMainInterface.loadData();
    const expectData = fs.readJsonSync(dataPath, {
      reviver: (key: string, value: unknown) => {
        if (key !== 'date') return value;
        return new Date(value as string);
      },
    });
    expect(data).toEqual(expectData);
    expect(data[0].date.toISOString).toBeTruthy();
  });
  test('データ無し', async () => {
    fs.removeSync(dataPath);
    const data = await ipcMainInterface.loadData();
    expect(data).toEqual([]);
  });
});
test('データの保存', async () => {
  fs.removeSync(dataPath);
  const saveData: Competition[] = [
    {
      id: '999',
      courseCount: 99,
      date: new Date('2022-01-01T10:00:00Z'),
      note: 'note-999',
      place: 'place-999',
      scores: [],
      title: 'title-999',
    },
  ];
  await ipcMainInterface.saveData({}, saveData);
  const newData = fs.readJsonSync(dataPath, { encoding: 'utf-8' });
  expect(newData).toEqual(JSON.parse(JSON.stringify(saveData)));
});
