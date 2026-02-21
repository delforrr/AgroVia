import { Box, Grid, Paper, Typography } from '@mui/material';
import Navbar from '../components/Navbar.jsx';
import HeroCard from '../components/HeroCard.jsx';

export default function InicioPage() {
    return (
        <>
            <Navbar title="Inicio" />

            <Box sx={{ padding: { xs: 2, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ flexGrow: 1 }}>
                    <Grid size={{ md: 3, lg: 3, xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <HeroCard userName="Delfor" />
                    </Grid>
                    <Grid size={{ md: 9, lg: 9, xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, borderRadius: 5, flexGrow: 1 }}>
                            <Typography variant="h5" gutterBottom>Panel de Control</Typography>
                            <Typography variant="body1">Selecciona una opción del menú para comenzar.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}