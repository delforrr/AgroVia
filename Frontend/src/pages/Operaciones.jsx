import { Box, Paper, Typography } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

export default function OperacionesPage() {
    return (
        <>
            <Navbar title="Operaciones  " />
            <Box sx={{ padding: { xs: 2, md: 3 }, flexGrow: 1 }}>

                <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, borderRadius: 5 }}>
                    <Typography variant="h5" gutterBottom>Operaciones</Typography>
                    <Typography variant="body1">Contenido de la sección Operaciones.</Typography>

                </Paper>
            </Box>
        </>
    )
}