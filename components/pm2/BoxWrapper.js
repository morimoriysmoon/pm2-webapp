import React from 'react';

import Box from '@mui/material/Box';

const BoxWrapper = (props) => {
  return <Box sx={{ m: '10px', p: '5px', ...props.sx }}>{props.children}</Box>;
};

export default BoxWrapper;
