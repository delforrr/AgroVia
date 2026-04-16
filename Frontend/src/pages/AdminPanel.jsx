// Panel de Administración de AgroVia — solo accesible para usuarios con rol 'admin'.
// La protección de ruta se maneja en App.jsx mediante <ProtectedRoute requiredRole="admin">.

import { useState, useEffect } from 'react';
import {
    Box, Typography, Tabs, Tab, Stack, Paper, Fade, Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';

import Navbar from '../components/layout/Navbar.jsx';
import AdminStats from '../components/features/admin/AdminStats.jsx';
import TabUsuarios from '../components/features/admin/TabUsuarios.jsx';
import TabAvisos from '../components/features/admin/TabAvisos.jsx';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';

export default function AdminPanelPage() {
    const { getAccessToken } = useAuth();
    const [tab, setTab]       = useState(0);
    const [stats, setStats]   = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(({ data }) => setStats(data))
            .catch(console.error)
            .finally(() => setLoadingStats(false));
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Admin" />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                    <AdminPanelSettingsIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Panel de Administración</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestioná usuarios, avisos y configuraciones globales de la plataforma.
                        </Typography>
                    </Box>
                </Stack>

                {/* Stats */}
                <AdminStats stats={stats} loading={loadingStats} />

                {/* Tabs */}
                <Paper
                    elevation={0}
                    sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
                >
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
                        <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab
                                id="tab-admin-usuarios"
                                icon={<PeopleOutlineIcon fontSize="small" />}
                                iconPosition="start"
                                label="Usuarios"
                                value={0}
                                sx={{ minHeight: 52, fontWeight: 600, textTransform: 'none' }}
                            />
                            <Tab
                                id="tab-admin-avisos"
                                icon={<ListAltIcon fontSize="small" />}
                                iconPosition="start"
                                label="Avisos"
                                value={1}
                                sx={{ minHeight: 52, fontWeight: 600, textTransform: 'none' }}
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        <Fade in key={tab} timeout={250}>
                            <Box>
                                {tab === 0 && <TabUsuarios getToken={getAccessToken} />}
                                {tab === 1 && <TabAvisos />}
                            </Box>
                        </Fade>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
