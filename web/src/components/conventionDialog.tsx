import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { Convention } from '../controllers/convention';

type Props = {
  open: boolean;
  convention: Convention;
  onCommit: (con: Convention) => void;
  onClose: () => void;
};

export const ConventionDialog: React.FC<Props> = (props) => {
  const { open, convention: initConvention, onClose, onCommit } = props;
  const [convention, setConvention] = useState(initConvention);
  const onChangeString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const field = e.currentTarget.parentElement?.parentElement?.dataset[
        'id'
      ] as 'title' | 'place';
      const { value } = e.currentTarget;
      setConvention({ ...convention, [field]: value });
    },
    [convention],
  );
  const onChangeDate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      const date = dayjs(value).toDate();
      setConvention({ ...convention, date });
    },
    [convention],
  );
  const onClickCommitButton = useCallback(() => {
    onCommit(convention);
  }, [convention, onCommit]);
  const onClickCancelButton = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Dialog open={open}>
      <DialogContent data-testid="container">
        <Stack spacing={2}>
          <TextField
            label="イベント名"
            data-testid="title-input"
            value={convention.title}
            data-id="title"
            onChange={onChangeString}
          />
          <TextField
            label="開催日"
            data-testid="date-input"
            type="date"
            value={dayjs(convention.date).format('YYYY-MM-DD')}
            onChange={onChangeDate}
          />
          <TextField
            label="開催場所"
            data-testid="place-input"
            value={convention.place}
            data-id="place"
            onChange={onChangeString}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" onClick={onClickCancelButton}>
          キャンセル
        </Button>
        <Button
          data-testid="commit-button"
          onClick={onClickCommitButton}
          variant="contained"
        >
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
};
