import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const logsSelector = createSelector(
  (state) => state.logs,
  (data) => data,
);

const SmallTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: 14,
    color: 'black',
  },
});

const LogDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [outLog, setOutLog] = useState(null);
  const [errLog, setErrLog] = useState(null);

  const logs = useSelector(logsSelector);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (logs && logs.show) {
      setOutLog(logs.outLog);
      setErrLog(logs.errLog);
      setOpen(true);
    } else {
      setOutLog(null);
      setOutLog(null);
      setOpen(false);
    }
  }, [logs]);

  return (
    <>
      <Dialog open={open} maxWidth={'lg'} fullWidth={true} disableEscapeKeyDown={true}>
        <DialogTitle>Logs</DialogTitle>
        <DialogContent>
          <br />
          <Accordion square={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>Out</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SmallTextField size="small" disabled={false} multiline fullWidth value={`${outLog}`} />
            </AccordionDetails>
          </Accordion>
          <Accordion square={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, color: 'red' }}>Error</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SmallTextField size="small" disabled={false} multiline fullWidth value={`${errLog}`} />
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogDialog;
