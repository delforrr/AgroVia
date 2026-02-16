import { Card, CardContent, Typography, Stack } from '@mui/material';
import SunnyIcon from '@mui/icons-material/Sunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const iconMap = {
    sunny: SunnyIcon,
    cloudy: CloudIcon,
    rainy: WaterDropIcon,
    temp: ThermostatIcon,
};

export default function InfoCard({ text, description, icon }) {
    const IconComponent = iconMap[icon] || SunnyIcon;

    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
        }}>
            <CardContent>
                <Typography variant="h6">
                    {text}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1}>
                    <Typography variant="h5" fontWeight={600}>
                        {description}
                    </Typography>
                    <IconComponent sx={{
                        color: icon === 'sunny' ? 'orange' : 'primary.main',
                        fontSize: 35
                    }} />
                </Stack>
            </CardContent>
        </Card>)
}