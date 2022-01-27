import { contextBridge, ipcRenderer } from 'electron';
import { Competition } from '@amori-score/models';

export const mainApi = {
  loadData: () => {
    return ipcRenderer.invoke('loadData').then((data: Competition[]) => data);
  },
  saveData: (data: Competition[]) => {
    return ipcRenderer.invoke('saveData', data).then(() => true);
  },
};
contextBridge.exposeInMainWorld('mainApi', mainApi);
