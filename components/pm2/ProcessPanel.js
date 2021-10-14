import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { Stack } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { IconButton } from '@mui/material';

import ReplayIcon from '@mui/icons-material/Replay';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import BoxWrapper from './BoxWrapper';
import { byteToString } from '../common/CommonUtil';

const axios = require('axios');

const ProcessName = (props) => {
  const { name, expanded, onClick, fontSize } = props;
  return (
    <>
      <Stack spacing={1} direction="row" justifyContent="flex-start" alignItems="center">
        <Box>
          <IconButton onClick={onClick} sx={{ color: 'white' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Typography noWrap={true} sx={{ fontSize: `${fontSize}px`, fontWeight: 700, color: 'white' }}>
          {name}
        </Typography>
      </Stack>
    </>
  );
};

const ExpandedColumnHeader = (props) => {
  const { icon, title, value, running } = props;
  return (
    <>
      <Stack spacing={1} alignItems="flex-end">
        <Typography sx={{ fontSize: '30px', fontWeight: 700, color: 'white' }}>
          {icon}
          {` ${title}`}
        </Typography>
        <Typography sx={{ fontSize: '24px', color: running ? 'green' : 'red', fontWeight: 700 }}>{value}</Typography>
      </Stack>
    </>
  );
};

const ShrunkenColumnHeader = (props) => {
  const { icon, value, running } = props;
  return (
    <>
      <Stack spacing={1} direction="row" justifyContent="flex-start" alignItems="center" sx={{ mt: '5px' }}>
        {icon}
        <Typography noWrap={true} sx={{ fontSize: '20px', fontWeight: 700, color: running ? 'green' : 'red' }}>
          {value}
        </Typography>
      </Stack>
    </>
  );
};

const ScriptElement = (props) => {
  const { value } = props;
  return (
    <>
      <BoxWrapper sx={{ borderRadius: '3px', backgroundColor: 'rgba(200,200,200, 0.1)' }}>
        <Typography noWrap={true} sx={{ fontSize: '14px', marginLeft: '10px', color: 'white' }}>
          {value}
        </Typography>
      </BoxWrapper>
    </>
  );
};

const ActionButton = (props) => {
  const { title, icon, onClick, disabled, color } = props;
  return (
    <>
      <Button variant="contained" startIcon={icon} onClick={onClick} disabled={disabled} color={color ? color : 'primary'}>
        {title}
      </Button>
    </>
  );
};

const ProcessPanel = (props) => {
  const { data } = props;
  const { name, pm_id, pid } = data;
  const { cpu, memory } = data.monit;
  const { pm_exec_path, args, pm_cwd } = data.pm2_env;

  const [cpuCount, setCpuCount] = useState(cpu);
  const [memoryCount, setMemoryCount] = useState(memory);

  const [running, setRunning] = useState(false);

  // console.info(data);

  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(() => {
      axios.get(`/pm2/monit?pm_id=${pm_id}`).then((resp) => {
        const monit = resp.data;
        // console.info(monit);
        if (monit.error) {
          console.error('error');
          setCpuCount(0);
          setMemoryCount(0);
          return;
        }
        setCpuCount(monit.cpu);
        setMemoryCount(monit.memory);
      });
    }, 5000);
  }, []);

  useEffect(() => {
    setRunning(pid !== 0);
  }, [pid]);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleRestart = () => {
    axios
      .post(`/pm2/process/restart?pm_id=${pm_id}`)
      .then((resp) => {
        // console.info(resp.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStop = () => {
    axios
      .post(`/pm2/process/stop?pm_id=${pm_id}`)
      .then((resp) => {
        // console.info(resp.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/pm2/process/delete?pm_id=${pm_id}`)
      .then((resp) => {
        // console.info(resp.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLog = () => {
    axios
      .get(`/pm2/log?pm_id=${pm_id}`)
      .then((resp) => {
        // console.info(resp.data);
        const logs = resp.data;
        dispatch({ type: 'logs/set', payload: { ...logs, show: true } });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <BoxWrapper
      sx={{
        border: '1px solid rgba(0,0,0, 0.5)',
        borderRadius: '3px',
        backgroundColor: 'rgba(0,0,0, 0.8)',
      }}
    >
      {expanded ? (
        <Grid container spacing={2}>
          {/* TODO */}
          <Grid item xs={11}>
            <Grid container>
              {/* process name */}
              <Grid item xs={3}>
                <ProcessName name={name} expanded={expanded} onClick={handleExpand} fontSize={30} />
              </Grid>
              {/* detail : CPU */}
              <Grid item xs={2}>
                <ExpandedColumnHeader icon={<AcUnitIcon />} title={'CPU'} value={`${cpuCount} %`} running={running} />
              </Grid>
              {/* detail : memory consumption */}
              <Grid item xs={2}>
                <ExpandedColumnHeader icon={<Grid4x4Icon />} title={'Memory'} value={`${byteToString(memoryCount)}`} running={running} />
              </Grid>
              {/* detail : process Id */}
              <Grid item xs={2}>
                <ExpandedColumnHeader icon={<FingerprintIcon />} title={'PID'} value={`${pid}`} running={running} />
              </Grid>
              {/* status : running or stopped */}
              <Grid item xs={2}>
                <Stack spacing={1} alignItems="flex-end">
                  <Typography sx={{ fontSize: '30px', fontWeight: 700, color: running ? 'green' : 'red' }}>
                    {running ? 'Running' : 'Stopped'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <ScriptElement value={`Run script: ${pm_exec_path}`} />
                <ScriptElement value={`Run arguments: ${args ? args.join(' ') : ''}`} />
                <ScriptElement value={`Working directory: ${pm_cwd}`} />
              </Grid>
            </Grid>
          </Grid>
          {/* action buttons */}
          <Grid item xs={1}>
            <Stack spacing={1} sx={{ mt: '3px' }}>
              <ActionButton title={'Restart'} icon={<ReplayIcon />} onClick={handleRestart} />
              <ActionButton title={'Log'} icon={<ArticleIcon />} onClick={handleLog} />
              <ActionButton title={'Update'} icon={<SecurityUpdateIcon />} onClick={handleLog} />
              <ActionButton title={'Stop'} icon={<DoNotDisturbAltIcon />} onClick={handleStop} disabled={!running} />
              <ActionButton title={'Delete'} icon={<DeleteIcon />} onClick={handleDelete} color={'error'} />
            </Stack>
          </Grid>
        </Grid>
      ) : (
        // summary
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ProcessName name={name} expanded={expanded} onClick={handleExpand} fontSize={20} />
          </Grid>
          <Grid item xs={2}>
            <ShrunkenColumnHeader icon={<AcUnitIcon sx={{ color: 'white' }} />} value={`${cpuCount} %`} running={running} />
          </Grid>
          <Grid item xs={2}>
            <ShrunkenColumnHeader icon={<Grid4x4Icon sx={{ color: 'white' }} />} value={`${byteToString(memoryCount)}`} running={running} />
          </Grid>
          <Grid item xs={2}>
            <ShrunkenColumnHeader icon={<FingerprintIcon sx={{ color: 'white' }} />} value={`${pid}`} running={running} />
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1} direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: '5px', mr: '20px' }}>
              <Typography noWrap={true} sx={{ fontSize: '20px', fontWeight: 700, color: running ? 'green' : 'red' }}>
                {running ? 'Running' : 'Stopped'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      )}
    </BoxWrapper>
  );
};

export default ProcessPanel;
