import React from 'react'
import FarmersInformation from './FarmersInformation'
import { Typography } from '@mui/material';

const MemberHome = () => {
  return (
    <>    
      <Typography variant="h4" gutterBottom>Employee Information</Typography>

      <div className="mt-10">
        <FarmersInformation />
      </div>
    </>
  );
}

export default MemberHome;
