import { createTheme, css } from '@mui/material/styles';
import fontUrl from './MPLUS1-Regular.ttf';

export const theme = createTheme({
  // 必要に応じて追加する{
  palette: {
    primary: {
      main: '#5c6bc0',
    },
    secondary: {
      main: '#ff9100',
    },
  },
});

export const globalStyle = css`
  @font-face {
    font-family: 'Roboto';
    src: url(${fontUrl});
  }
  body {
    background-color: ${theme.palette.grey[100]};
  }
  input {
    font-size: 100%;
  }
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    -moz-appearance: textfield;
  }
`;
