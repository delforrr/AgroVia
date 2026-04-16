// Widget de clima con datos de previsión — datos mock hasta integración de API real.

import { Box, Paper, Stack, Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const CLIMA_MOCK = [
    { dia: 'Hoy',    temp: '24°C', icon: <WbSunnyIcon sx={{ color: '#f9a825' }} />,  desc: 'Soleado', humedad: '45%' },
    { dia: 'Mañana', temp: '19°C', icon: <CloudIcon sx={{ color: '#78909c' }} />,    desc: 'Nublado', humedad: '60%' },
    { dia: 'Pasado', temp: '15°C', icon: <WaterDropIcon sx={{ color: '#1976d2' }} />, desc: 'Lluvia',  humedad: '85%' },
];

export default function ClimaWidget() {
    return (
        <Paper
            elevation={0}
            sx={{ borderRadius: 4, p: 2, border: '1px solid rgba(0,0,0,0.08)' }}
        >
            <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.05em"
                mb={1.5}
            >
                Clima — Córdoba
            </Typography>
            <Stack spacing={1.5}>
                {CLIMA_MOCK.map((c) => (
                    <Stack
                        key={c.dia}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            {c.icon}
                            <Box>
                                <Typography variant="body2" fontWeight={600}>{c.dia}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {c.desc} · 💧{c.humedad}
                                </Typography>
                            </Box>
                        </Stack>
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                            {c.temp}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
}
