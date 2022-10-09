import { Competition } from '@amori-score/models';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCompetition } from '../actions/actions';
import { GlobalState } from '../globalState';

type Props = Omit<DialogProps, 'open'> & {
  onCommit: (con: Competition) => void;
  onClose: () => void;
};

type Errors = Partial<{ [key in keyof Competition]: boolean }>;
const hasError = (errors: Errors) => {
  return Object.entries(errors).some(([, val]) => {
    if (typeof val !== 'boolean') return false;
    return val;
  });
};

export const CompetitionDialog: React.FC<Props> = (props) => {
  const { competition: initCompetition, open } = useSelector<
    GlobalState,
    GlobalState['competitionDialog']
  >((s) => s.competitionDialog);
  const dispatch = useDispatch();
  const { onClose, onCommit, ...dialogProps } = props;
  const [competition, setCompetition] = useState(initCompetition);
  useEffect(() => {
    setCompetition(initCompetition);
  }, [initCompetition]);
  const [errors, setErrors] = useState<Errors>({});
  const onChangeString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const field = e.currentTarget.dataset['id'] as 'title' | 'place';
      const { value } = e.currentTarget;
      setCompetition({ ...competition, [field]: value });
      setErrors({ ...errors, [field]: value.trim() === '' });
    },
    [competition, errors],
  );
  const onChangeDate = useCallback(
    (date: Dayjs | null) => {
      if (!date) {
        setErrors({ ...errors, date: true });
        return;
      }
      setCompetition({ ...competition, date: date.toDate() });
      setErrors({ ...errors, date: !date.isValid() });
    },
    [competition, errors],
  );
  const onChangeNumber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      const count = Number(value) || -1;
      setCompetition({ ...competition, courseCount: count });
      setErrors({ ...errors, courseCount: count < 1 });
    },
    [competition, errors],
  );
  const onClickCommitButton = useCallback(() => {
    if (hasError(errors)) return;
    onCommit(competition);
    onClose();
  }, [competition, errors, onClose, onCommit]);
  const onClickCancelButton = useCallback(() => {
    onClose();
  }, [onClose]);
  const onDialogClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const onClickDeleteCompeButton = useCallback(() => {
    if (
      !window.confirm(
        'このイベントを削除します。もとに戻すことはできません。\nよろしいですか？',
      )
    )
      return;
    dispatch(deleteCompetition(competition.id));
  }, [competition.id, dispatch]);

  return (
    <Dialog
      {...dialogProps}
      open={open}
      onClose={onDialogClose}
      data-testid="competition-dialog"
    >
      <DialogContent data-testid="container">
        <Stack spacing={2}>
          <TextField
            label="イベント名"
            data-testid="title-input"
            value={competition.title}
            onChange={onChangeString}
            inputProps={{ 'data-id': 'title' }}
            error={errors.title}
          />
          <DesktopDatePicker
            label="開催日"
            inputFormat="YYYY/MM/DD"
            value={competition.date}
            onChange={onChangeDate}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderInput={(params: any) => (
              <TextField
                {...params}
                data-testid="date-input"
                error={errors.date}
              />
            )}
            mask="____/__/__"
          />
          <TextField
            label="開催場所"
            data-testid="place-input"
            value={competition.place}
            onChange={onChangeString}
            inputProps={{ 'data-id': 'place' }}
            error={errors.place}
          />
          <TextField
            label="コース数"
            data-testid="course-count"
            value={competition.courseCount < 1 ? '' : competition.courseCount}
            type="number"
            inputProps={{ 'data-id': 'courseCount' }}
            error={errors.courseCount}
            onChange={onChangeNumber}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="delete-compe-button"
          startIcon={<DeleteIcon />}
          onClick={onClickDeleteCompeButton}
        >
          削除
        </Button>
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
