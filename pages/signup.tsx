import { AuthContext } from '@/context/auth';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';


export default function Signup(): JSX.Element {

    const { loading, signup, user } = useContext(AuthContext);

    const [error, setError] = useState<string | false>(false);

    const router = useRouter();

    useEffect(() => {
        if(!loading && user) {
            router.push('/app');
        }
    }, [loading, user, router]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setError(false);

        if (data.get('password') !== data.get('confirmPassword')) {
            setError("Password don't match");
            return;
        }

        signup(data.get('email') as string, data.get('password') as string, data.get('name') as string)
            .catch((e: AppwriteException) => setError(e.message));

    };

    return <Container component="main" maxWidth="xs">
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="given-name"
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Container>
}