import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, RenderOptions } from '@testing-library/react';
import MockDate from 'mockdate';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { GlobalState } from '../../globalState';
import { reducer } from '../../reducer';

const theme = createTheme();

MockDate.set(new Date('2022-01-02'));

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
    theme,
  ] as const;
};
