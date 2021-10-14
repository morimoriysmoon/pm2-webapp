import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { Typography } from '@mui/material';

import ProcessToolbox from './ProcessToolbox';
import ProcessPanel from './ProcessPanel';
import BoxWrapper from './BoxWrapper';
import LogDialog from './LogDialog';

const axios = require('axios');

const processesSelector = createSelector(
  (state) => state.processes, // inputSelector
  (data) => data, // resultFunc
);

const ProcessDashboard = () => {
  const processes = useSelector(processesSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/pm2/list').then((resp) => {
      const data = resp.data;
      dispatch({ type: 'process/setItems', payload: { items: data.items } });
    });
  }, []);

  return (
    <>
      <BoxWrapper>
        <Typography variant="h4">{'Process Management'}</Typography>
      </BoxWrapper>
      <LogDialog />
      <ProcessToolbox />
      {processes.map((item) => (
        <ProcessPanel data={item} key={item.pid} />
      ))}
    </>
  );
};

export default ProcessDashboard;
