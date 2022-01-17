import {
  Box,
  Button,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Player } from '../controllers/player';

type Props = {
  open: boolean;
  player: Player;
  onCommit: (player: Player) => void;
  onClose: () => void;
};

const styles = {
  formRow: css`
    margin: 1rem 0;
  `,
};

export const PlayerDialog: React.FC<Props> = (props) => {
  const { open, player: _player, onCommit, onClose } = props;
  const [player, setPlayer] = useState(_player);
  const [errors, setErrors] = useState<{ name: boolean; age: boolean }>({
    name: false,
    age: false,
  });
  const hasError = useCallback(
    (player: Player) => {
      const newErrors = { ...errors };
      newErrors.name = player.name.trim() === '';
      newErrors.age = player.age === -1;
      setErrors(newErrors);
      return newErrors.age || newErrors.name;
    },
    [errors],
  );
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.currentTarget;
      let value: string | number = e.currentTarget.value;
      if (name === 'age') {
        value = value ? Number(value) || -1 : -1;
      }

      const newPlayer = { ...player, [name]: value };
      setPlayer(newPlayer);
      hasError(newPlayer);
    },
    [hasError, player],
  );
  const onSave = useCallback(() => {
    if (hasError(player)) return;
    onCommit(player);
  }, [hasError, onCommit, player]);
  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Dialog open={open} data-testid="dialog">
      <DialogTitle>参加者</DialogTitle>
      <DialogContent
        css={css`
          padding: 1rem;
        `}
      >
        <Box css={styles.formRow}>
          <TextField
            label="名前"
            value={player.name}
            name="name"
            data-testid="name-textbox"
            onChange={onChange}
            error={errors.name}
          />
        </Box>
        <Box css={styles.formRow}>
          <TextField
            label="年齢"
            value={player.age === -1 ? '' : player.age.toString()}
            data-testid="age-textbox"
            name="age"
            onChange={onChange}
            type="number"
            error={errors.age}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" onClick={onCancel}>
          キャンセル
        </Button>
        <Button data-testid="save-button" onClick={onSave} variant="contained">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
};