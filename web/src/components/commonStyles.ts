import { css } from '@emotion/react';
import { Theme, useTheme } from '@mui/material';
import { useMemo } from 'react';

export const useStyles = <T>(fn: (theme: Theme) => T) => {
  const theme = useTheme();
  return useMemo(() => fn(theme), [fn, theme]);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const useCommonStyles = (theme: Theme) => {
  return useMemo(
    () => ({
      lane: {
        root: css`
          display: flex;
          align-items: center;
          align-content: center;
          border-bottom: 1px solid ${theme.palette.grey[200]};
          &.header {
            border-bottom: 1px solid ${theme.palette.grey[500]};
          }
        `,
        rowHeader: css`
          width: 10rem;
        `,
        cell: css`
          & > input,
          &.header {
            border-style: none;
            border-left: 1px solid ${theme.palette.grey[200]};
            box-sizing: border-box;
            width: 40px;
            padding: 0.5em;
            text-align: right;
            &:focus {
              background-color: ${theme.palette.primary.light};
              border-style: none;
            }
          }
        `,
        total: css`
          margin-left: 1rem;
          width: 2rem;
          text-align: right;
        `,
      },
    }),
    [theme.palette.grey, theme.palette.primary.light],
  );
};
