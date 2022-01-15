import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { reducer } from '../../reducer';
import { GlobalState } from '../../globalState';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { LocalizationProvider } from '@mui/lab';

const theme = createTheme();

const testProvider =
  // eslint-disable-next-line react/display-name, @typescript-eslint/ban-types
  (store: Store<GlobalState>) => (props: React.PropsWithChildren<{}>) => {
    return (
      <>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
          </Provider>
        </LocalizationProvider>
      </>
    );
  };

export const customRender = (
  ui: ReactElement,
  initState?: Partial<GlobalState>,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const store = createStore(reducer(initState));

  return [
    render(ui, { wrapper: testProvider(store), ...options }),
    store,
  ] as const;
};
