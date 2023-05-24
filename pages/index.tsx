import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AuthContext } from '@/context/auth';
import { CircularProgress, LinearProgress } from '@mui/material';

export default function Home() {

  const {loading} = React.useContext(AuthContext);




  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        <Typography variant="h4" component="h1" gutterBottom>
          Tinto
        </Typography>
        {loading && <CircularProgress/>}
        
      </Box>
    </Container>
  );
}
