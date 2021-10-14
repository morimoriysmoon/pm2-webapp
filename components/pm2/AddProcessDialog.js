import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const axios = require('axios');

const AddProcessDialog = (props) => {
  const { open, onClose } = props;

  const [procName, setProcName] = useState(null);
  const [procScript, setProcScript] = useState(null);
  const [procArgs, setProcArgs] = useState(null);
  const [proCWD, setProcCWD] = useState(null);

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const handleClose = (event) => {
    setError(null);
    onClose();
  };

  const handleAdd = (event) => {
    try {
      setDisable(true);

      if (!procName || !procScript) {
        setError('Name/Script required');
        return;
      }

      const postData = { name: procName, script: procScript, args: procArgs, cwd: proCWD };
      axios
        .post('/pm2/process/add', postData)
        .then((resp) => {
          // update process list
          axios.get('/pm2/list').then((resp) => {
            const data = resp.data;
            dispatch({ type: 'process/setItems', payload: { items: data.items } });
            onClose();
          });
        })
        .catch((error) => {
          console.info(error);
          setError('Error thrown');
        });
    } catch (ex) {
    } finally {
      setDisable(false);
    }
  };

  const handleChangeOnName = (event) => {
    setProcName(event.target.value);
  };

  const handleChangeOnScript = (event) => {
    setProcScript(event.target.value);
  };

  const handleChangeOnArgs = (event) => {
    setProcArgs(event.target.value);
  };

  const handleChangeOnCWD = (event) => {
    setProcCWD(event.target.value);
  };

  return (
    <>
      <Dialog open={open} maxWidth={'md'} fullWidth={true} disableEscapeKeyDown={true}>
        <DialogTitle>Add Process</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the name of process and script to run.</DialogContentText>
          <TextField margin="dense" label="Name" fullWidth onChange={handleChangeOnName} disabled={disable} placeholder={'myApp'} />
          <TextField margin="dense" label="Script" fullWidth onChange={handleChangeOnScript} disabled={disable} placeholder={'java.exe'} />
          <TextField
            margin="dense"
            label="Arguments"
            fullWidth
            onChange={handleChangeOnArgs}
            disabled={disable}
            placeholder={'-jar nodel.jar -p 0'}
          />
          <TextField
            margin="dense"
            label="Working directory"
            fullWidth
            onChange={handleChangeOnCWD}
            disabled={disable}
            placeholder={'c:\\working_directory'}
          />
          {error ? <Typography sx={{ color: 'red', mt: '10px', fontWeight: 700 }}>{error}</Typography> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={disable}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdd} disabled={disable}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddProcessDialog;
