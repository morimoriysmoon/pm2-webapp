import React, { useState } from 'react';

import { Stack } from '@mui/material';
import { Button } from '@mui/material';

import BoxWrapper from './BoxWrapper';
import AddProcessDialog from './AddProcessDialog';

const ProcessToolbox = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const handleAddOnClose = () => {
    setOpenAdd(false);
  };

  return (
    <BoxWrapper>
      <Stack direction="row-reverse" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        <Button variant="contained" size="large">
          {'Edit Ecosystem'}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpenAdd(true);
          }}
          size="large"
        >
          {'Add Process'}
        </Button>
      </Stack>
      <AddProcessDialog open={openAdd} onClose={handleAddOnClose} />
    </BoxWrapper>
  );
};

export default ProcessToolbox;
