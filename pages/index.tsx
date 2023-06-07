import {useContext, useEffect} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AuthContext } from '@/context/auth';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { DatabaseContext } from '@/context/database';

export default function Home() {

  const {loading, user} = useContext(AuthContext);

  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (!loading && user) {
      router.push('/app');
    }

  }, [loading, user, router]);




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
