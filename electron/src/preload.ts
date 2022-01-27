import { contextBridge, ipcRenderer } from 'electron';
import { Competition } from '@amori-score/models';

export const mainApi = {
  loadData: () => {
    return ipcRenderer.invoke('load-data').then((data: Competition[]) => data);
  },
};
contextBridge.exposeInMainWorld('mainApi', mainApi);
