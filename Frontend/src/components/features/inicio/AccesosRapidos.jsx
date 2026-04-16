// Widget de accesos rápidos — grid de cards de navegación del dashboard.

import { Stack, Card, CardActionArea, Avatar, Typography } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const ACCESOS = [
    { icon: <StoreIcon />,     label: 'Avisos',      sublabel: 'Ver publicaciones', color: '#6A8E5E', to: '/avisos' },
    { icon: <ShowChartIcon />, label: 'Mercado',     sublabel: 'Cotizaciones',      color: '#1565c0', to: '/mercado' },
    { icon: <HandshakeIcon />, label: 'Operaciones', sublabel: 'Negociaciones',     color: '#7b1fa2', to: '/operaciones' },
    { icon: <PersonIcon />,    label: 'Mi Perfil',   sublabel: 'Cuenta y datos',    color: '#A0785E', to: '/perfil' },
];

function QuickCard({ icon, label, sublabel, color, onClick }) {
    return (
        <Card
            elevation={0}
            sx={{
                flex: '1 1 130px',
                border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-3px)' },
            }}
        >
            <CardActionArea onClick={onClick} sx={{ p: 2, height: '100%' }}>
                <Avatar sx={{ bgcolor: `${color}20`, color, width: 44, height: 44, mb: 1.5 }}>
                    {icon}
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                    {label}
                </Typography>
                {sublabel && (
                    <Typography variant="caption" color="text.secondary">
                        {sublabel}
                    </Typography>
                )}
            </CardActionArea>
        </Card>
    );
}

export default function AccesosRapidos() {
    const navigate = useNavigate();
    return (
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {ACCESOS.map((a) => (
                <QuickCard key={a.label} {...a} onClick={() => navigate(a.to)} />
            ))}
        </Stack>
    );
}
