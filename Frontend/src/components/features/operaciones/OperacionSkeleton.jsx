// Skeleton de carga para una card de operación.

import { Card, Skeleton } from '@mui/material';

export default function OperacionSkeleton() {
    return (
        <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.09)', borderRadius: 3, p: 2 }}>
            <Skeleton variant="rounded" width={180} height={22} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={18} />
            <Skeleton variant="rounded" height={8} sx={{ mt: 2, borderRadius: 4 }} />
        </Card>
    );
}
