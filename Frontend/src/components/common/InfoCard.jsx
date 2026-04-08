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
            boxShadow: '0px 0px 5px 3px rgba(66, 68, 90, 0.19)',
            '& .MuiCardContent-root:last-child': {
                paddingBottom: "16px",
            }
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
                        fontSize: 32
                    }} />
                </Stack>
            </CardContent>
        </Card>)
}