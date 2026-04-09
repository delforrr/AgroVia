// Página que muestra el mercado de productos y servicios

import { useState } from 'react';
import {
    Box, Typography, Tab, Tabs, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Tooltip, Skeleton, Alert, Paper, Stack, Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GrainIcon from '@mui/icons-material/Grain';
import PetsIcon from '@mui/icons-material/Pets';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import Navbar from '../components/layout/Navbar.jsx';
import { useCotizaciones } from '../hooks/useCotizaciones.js';

// ── Formateadores ─────────────────────────────────────────────────────
const fmtPrecio = (n, decimales = 0) =>
    n?.toLocaleString('es-AR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }) ?? '—';

const fmtHora = (date) =>
    date
        ? date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '—';

// ── Chip de variación ─────────────────────────────────────────────────
function VarChip({ pct }) {
    if (pct == null) return null;
    const positivo = pct >= 0;
    return (
        <Chip
            size="small"
            icon={positivo ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            label={`${positivo ? '+' : ''}${pct}%`}
            sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: positivo ? '#e8f5e9' : '#fce4ec',
                color: positivo ? '#2e7d32' : '#c62828',
                '& .MuiChip-icon': { color: 'inherit' },
            }}
        />
    );
}

// ── Fila de skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <TableRow>
            {[1, 2, 3, 4, 5].map((i) => (
                <TableCell key={i}><Skeleton variant="text" width="80%" /></TableCell>
            ))}
        </TableRow>
    );
}

// ── Tabla genérica ────────────────────────────────────────────────────
function TablaCotizaciones({ rows, loading, colPrecio }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">{colPrecio ?? 'Precio'}</TableCell>
                        <TableCell align="right">Unidad</TableCell>
                        <TableCell align="right">Var. día</TableCell>
                        <TableCell>Mercado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                        : rows?.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                sx={{
                                    '&:last-child td': { border: 0 },
                                    transition: 'background-color 0.15s',
                                }}
                            >
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    {row.nombre}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'primary.main' }}>
                                    ${fmtPrecio(row.precio, row.unidad.includes('kg') ? 0 : 0)}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="caption" color="text.secondary">{row.unidad}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <VarChip pct={row.var_pct} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">{row.mercado}</Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// ── Stat card de resumen ──────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
    return (
        <Paper
            elevation={0}
            sx={{
                flex: '1 1 140px',
                p: 2,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.07)',
                background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
            }}
        >
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
                {label}
            </Typography>
            <Typography variant="h6" fontWeight={700} color={color} lineHeight={1.2} mt={0.5}>
                {value}
            </Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </Paper>
    );
}

// ── Página principal ──────────────────────────────────────────────────
export default function MercadoPage() {
    const [tabActivo, setTabActivo] = useState(0);
    const { data, loading, error, refetch, lastUpdated } = useCotizaciones();

    const tabs = [
        { label: 'Granos',   icon: <GrainIcon fontSize="small" />,        key: 'granos',   col: 'Precio ($/tn)' },
        { label: 'Hacienda', icon: <PetsIcon fontSize="small" />,          key: 'hacienda', col: 'Precio ($/kg)' },
        { label: 'Divisas',  icon: <AttachMoneyIcon fontSize="small" />,   key: 'divisas',  col: 'Tipo de cambio' },
    ];

    const filas = data?.[tabs[tabActivo].key] ?? [];
    const mejores = filas.filter((r) => r.var_pct > 0).length;
    const peores = filas.filter((r) => r.var_pct < 0).length;
    const maxSubida = filas.reduce((a, b) => (b.var_pct > (a?.var_pct ?? -Infinity) ? b : a), null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Mercado" />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>

                {/* ── Header ── */}
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" mb={2} spacing={1}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            Cotizaciones del Mercado
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {lastUpdated
                                    ? `Última actualización: ${fmtHora(lastUpdated)}`
                                    : 'Cargando datos del mercado…'
                                }
                            </Typography>
                        </Stack>
                    </Box>

                    <Tooltip title="Actualizar cotizaciones">
                        <span>
                            <IconButton
                                id="btn-actualizar-cotizaciones"
                                onClick={refetch}
                                disabled={loading}
                                sx={{
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    borderRadius: 2,
                                    animation: loading ? 'spin 1s linear infinite' : 'none',
                                    '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>

                {/* ── Error ── */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={refetch}>
                        {error} — <strong>Reintentando…</strong>
                    </Alert>
                )}

                {/* ── Stat cards ── */}
                {!loading && !error && (
                    <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
                        <StatCard
                            label="Con alza"
                            value={`${mejores} de ${filas.length}`}
                            sub="productos subieron"
                            color="#2e7d32"
                        />
                        <StatCard
                            label="Con baja"
                            value={`${peores} de ${filas.length}`}
                            sub="productos bajaron"
                            color="#c62828"
                        />
                        {maxSubida && (
                            <StatCard
                                label="Mayor suba"
                                value={`${maxSubida.nombre}`}
                                sub={`+${maxSubida.var_pct}%`}
                                color="#1565c0"
                            />
                        )}
                    </Stack>
                )}

                {/* ── Tabs + Tabla ── */}
                <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.07)', px: 1 }}>
                        <Tabs
                            value={tabActivo}
                            onChange={(_, v) => setTabActivo(v)}
                            aria-label="Categorías de mercado"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            {tabs.map((tab, idx) => (
                                <Tab
                                    key={tab.key}
                                    id={`tab-mercado-${tab.key}`}
                                    icon={tab.icon}
                                    iconPosition="start"
                                    label={tab.label}
                                    value={idx}
                                    sx={{ minHeight: 48, fontWeight: 600, textTransform: 'none' }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    <Box sx={{ p: { xs: 0, md: 1 } }}>
                        <TablaCotizaciones
                            rows={filas}
                            loading={loading}
                            colPrecio={tabs[tabActivo].col}
                        />
                    </Box>

                    {!loading && (
                        <>
                            <Divider />
                            <Box sx={{ px: 2, py: 1.5, backgroundColor: 'background.sidebar' }}>
                                <Typography variant="caption" color="text.secondary">
                                    ⚡ Datos de referencia. Precios sujetos a variación según condiciones de mercado. Fuente: {tabs[tabActivo].key === 'granos' ? 'MATBA-ROFEX / Bolsa de Rosario' : tabs[tabActivo].key === 'hacienda' ? 'Mercado de Liniers' : 'BCRA'}.
                                </Typography>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}