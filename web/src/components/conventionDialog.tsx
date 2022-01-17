import { DesktopDatePicker } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  TextField,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import React, { useCallback, useState } from 'react';
import { Convention } from '../controllers/convention';

type Props = DialogProps & {
  // open: boolean;
  convention: Convention;
  onCommit: (con: Convention) => void;
  onClose: () => void;
};

type Errors = Partial<{ [key in keyof Convention]: boolean }>;
const hasError = (errors: Errors) => {
  return Object.entries(errors).some(([, val]) => {
    if (typeof val !== 'boolean') return false;
    return val;
  });
};

export const ConventionDialog: React.FC<Props> = (props) => {
  const {
    convention: initConvention,
    onClose,
    onCommit,
    ...dialogProps
  } = props;
  const [convention, setConvention] = useState(initConvention);
  const [errors, setErrors] = useState<Errors>({});
  const onChangeString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const field = e.currentTarget.dataset['id'] as 'title' | 'place';
      const { value } = e.currentTarget;
      setConvention({ ...convention, [field]: value });
      setErrors({ ...errors, [field]: value.trim() === '' });
    },
    [convention, errors],
  );
  const onChangeDate = useCallback(
    (date: Dayjs | null) => {
      if (!date) {
        setErrors({ ...errors, date: true });
        return;
      }
      setConvention({ ...convention, date: date.toDate() });
      setErrors({ ...errors, date: !date.isValid() });
    },
    [convention, errors],
  );
  const onClickCommitButton = useCallback(() => {
    if (hasError(errors)) return;
    onCommit(convention);
  }, [convention, errors, onCommit]);
  const onClickCancelButton = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Dialog {...dialogProps}>
      <DialogContent data-testid="container">
        <Stack spacing={2}>
          <TextField
            label="イベント名"
            data-testid="title-input"
            value={convention.title}
            onChange={onChangeString}
            inputProps={{ 'data-id': 'title' }}
            error={errors.title}
          />
          <DesktopDatePicker
            label="開催日"
            inputFormat="YYYY/MM/DD"
            value={convention.date}
            onChange={onChangeDate}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="date-input"
                error={errors.date}
                // inputProps={{ 'data-id': 'date' }}
              />
            )}
            mask="____/__/__"
          />
          <TextField
            label="開催場所"
            data-testid="place-input"
            value={convention.place}
            onChange={onChangeString}
            inputProps={{ 'data-id': 'place' }}
            error={errors.place}
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
