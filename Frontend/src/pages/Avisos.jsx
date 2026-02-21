import { Box, Paper, Typography } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

export default function AvisosPage() {
    return (
        <>
            <Navbar title="Perfil" />
            <Box sx={{ padding: { xs: 2, md: 3 }, flexGrow: 1 }}>

                <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, borderRadius: 5 }}>
                    <Typography variant="h5" gutterBottom>Avisos</Typography>
                    <Typography variant="body1">Contenido de la sección Avisos.</Typography>

                </Paper>
            </Box>
        </>)
}