import { Paper, Box, Typography, Stack, useTheme } from '@mui/material';
import { Leaf } from "@boxicons/react"
import InfoCard from './InfoCard';

export default function HeroCard({ userName = "Usuario" }) {
    const theme = useTheme();

    return (
        <Paper elevation={4} sx={{
            borderRadius: 5,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'background.paper',
        }}>
            <Box sx={{
                backgroundColor: 'primary.main',
                borderRadius: 'inherit',
                height: '30%',
                padding: 2,
                boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.2)',
                color: 'primary.contrastText',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant='h5'>
                        AgroVía
                    </Typography>
                    <Leaf fill='#8adc6f' width={40} height={40}/>
                </Stack>

                <Typography variant='h4'>
                    Hola, {userName}! Bienvenido a AgroVía
                </Typography>
            </Box>

            <Box sx={{
                padding: 2,
            }}>
                <InfoCard text="Clima Hoy:" description="Soleado, 24°C" icon="sunny" />
            </Box>
        </Paper>
    )
}
