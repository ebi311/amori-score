import { contextBridge, ipcRenderer } from 'electron';
import { Competition } from '../../models/competition';

contextBridge.exposeInMainWorld('mainApi', {
  loadData: () => {
    ipcRenderer.invoke('load-data').then((data: Competition[]) => {
      console.log(data);
    });
  },
});
