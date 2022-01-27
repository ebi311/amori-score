import { Competition } from '@amori-score/models';
import { Global } from '@emotion/react';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import clone from 'clone';
import deepEqual from 'deep-equal';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './components/app';
import { createScore, ScoreData } from './controllers/score';
import { reducer } from './reducer';
import { globalStyle, theme } from './theme';

declare global {
  interface Window {
    mainApi: {
      loadData: () => Promise<
        (Omit<Competition, 'scores'> & { scores: ScoreData[] })[]
      >;
      saveData: (data: Competition[]) => Promise<boolean>;
    };
  }
}

window.mainApi.loadData().then((compeList) => {
  const convertedCompeList = compeList.map((compe) => {
    const scores = compe.scores.map((s) => createScore(s));
    return { ...compe, scores };
  });
  let lastCompeList = clone(convertedCompeList);
  const store = createStore(
    reducer({
      competitionList: convertedCompeList,
    }),
  );
  store.subscribe(() => {
    const newCompeList = store.getState().competitionList;
    if (!deepEqual(lastCompeList, newCompeList)) {
      window.mainApi
        .saveData(newCompeList)
        .then(() => {
          lastCompeList = clone(newCompeList);
        })
        .catch((e) => console.error(e));
    }
  });
  render(
    <>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Provider store={store}>
          <Global styles={globalStyle} />
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </LocalizationProvider>
    </>,
    document.getElementById('app'),
  );
});
