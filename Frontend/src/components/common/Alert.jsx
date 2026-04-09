// Componente genérico para mostrar alertas al usuario

export default function Alert({ tipo, mensaje, tiempo }) {
    return (
        <Box sx={{
            p: 1.25, borderRadius: 2,
            bgcolor: tipo === 'warning' ? '#fff8e1' : '#f3f8ff',
            borderLeft: `3px solid ${tipo === 'warning' ? '#f9a825' : '#1976d2'}`,
        }}>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.4}>
                {mensaje}
            </Typography>
            <Typography variant="caption" color="text.secondary">hace {tiempo}</Typography>
        </Box>
    )
}