import { Paper, Box, Typography, Stack, useTheme } from '@mui/material';
import { Leaf } from "@boxicons/react"
import InfoCard from './InfoCard';

export default function HeroCard({ userName = "Usuario" }) {
    const theme = useTheme();

    return (
        <Stack spacing={{ xs: 1, md: 2 }} sx={{ height: '100%' }}>
            <Paper elevation={4} sx={{
                borderRadius: 5,
                backgroundColor: 'primary.main',
                padding: 2,
                color: 'primary.contrastText',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px'
            }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant='h5'>
                        AgroVía
                    </Typography>
                    <Leaf fill='#8adc6f' width={35} height={35}/>
                </Stack>

                <Typography variant='h4'>
                    Hola, {userName}! Bienvenido a AgroVía
                </Typography>
            </Paper>

            <InfoCard text="Clima Hoy:" description="Soleado, 24°C" icon="sunny" />
        </Stack>
    )
}
