import { Global } from '@emotion/react';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './components/app';
import { reducer } from './reducer';
import { globalStyle, theme } from './theme';

const store = createStore(reducer());

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
