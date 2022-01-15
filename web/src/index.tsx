import { Global } from '@emotion/react';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './components/app';
import { Convention } from './controllers/convention';
import { reducer } from './reducer';
import { globalStyle, theme } from './theme';

const conventions: Convention[] = [...Array(3)].map((_, i) => ({
  id: i.toString().padStart(3, '0'),
  title: `イベント${i}`,
  date: new Date(`2022-01-1${i}T00:00:00Z`),
  note: `びこう${i}`,
  place: `場所${i}`,
}));

const store = createStore(reducer({ conventionList: conventions }));

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
