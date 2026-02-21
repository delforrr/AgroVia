import { Box, Paper, Typography } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

export default function MercadoPage() {
    return (
        <>
            <Navbar title="Avisos" />
            <Box sx={{ padding: { xs: 2, md: 3 }, flexGrow: 1 }}>

                <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, borderRadius: 5 }}>
                    <Typography variant="h5" gutterBottom>Mercado</Typography>
                    <Typography variant="body1">Contenido de la sección Mercado.</Typography>

                </Paper>
            </Box>
        </>
    )
}