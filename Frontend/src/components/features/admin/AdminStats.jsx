// Stat cards del dashboard admin — muestra métricas reales traídas de la BD.
// Recibe las stats ya parseadas desde AdminPanel.jsx vía /api/admin/stats.

import { Stack } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LayersIcon from '@mui/icons-material/Layers';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import StatCard from '../../common/StatCard.jsx';

/**
 * @param {object|null} stats   - Estadísticas del backend
 * @param {boolean}     loading - Estado de carga
 */
export default function AdminStats({ stats, loading }) {
    // Devuelve null mientras carga (StatCard maneja el skeleton) o el valor real
    const v = (key) => (loading ? null : stats?.[key] ?? 0);

    return (
        <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
            {/* ── Métricas de usuarios ──────────────────────────────────── */}
            <StatCard
                label="Usuarios registrados"
                value={v('total_usuarios')}
                icon={<PeopleIcon />}
                color="primary"
            />
            <StatCard
                label="Nuevos este mes"
                value={v('nuevos_este_mes')}
                icon={<FiberNewIcon />}
                color="info"
            />
            <StatCard
                label="Admins"
                value={v('total_admins')}
                icon={<AdminPanelSettingsIcon />}
                color="warning"
            />
            <StatCard
                label="Suspendidos"
                value={v('usuarios_suspendidos')}
                icon={<BlockIcon />}
                color="error"
            />
            {/* ── Métricas de avisos ────────────────────────────────────── */}
            <StatCard
                label="Avisos publicados"
                value={v('total_avisos')}
                icon={<LayersIcon />}
                color="secondary"
            />
            <StatCard
                label="Avisos activos"
                value={v('avisos_activos')}
                icon={<CheckCircleIcon />}
                color="success"
            />
            <StatCard
                label="Avisos pausados"
                value={v('avisos_pausados')}
                icon={<PauseCircleOutlineIcon />}
                color="warning"
            />
            <StatCard
                label="Avisos eliminados"
                value={v('avisos_eliminados')}
                icon={<DeleteOutlineIcon />}
                color="error"
            />
            <StatCard
                label="Vendedores activos"
                value={v('vendedores_activos')}
                icon={<StorefrontIcon />}
                color="success"
            />
        </Stack>
    );
}
