// Página de inicio de la aplicación — dashboard principal.
// Orquesta los widgets de inicio importados desde features/inicio/.

import { useState, useEffect } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar.jsx';
import BienvenidaCard      from '../components/features/inicio/BienvenidaCard.jsx';
import ClimaWidget         from '../components/features/inicio/ClimaWidget.jsx';
import AlertasWidget       from '../components/features/inicio/AlertasWidget.jsx';
import AccesosRapidos      from '../components/features/inicio/AccesosRapidos.jsx';
import CotizacionesWidget  from '../components/features/inicio/CotizacionesWidget.jsx';
import OperacionesActivas  from '../components/features/inicio/OperacionesActivas.jsx';
import AvisosRecientes     from '../components/features/inicio/AvisosRecientes.jsx';

import { getCotizaciones } from '../services/cotizacionesService.js';
import { getOperaciones } from '../services/operacionesService.js';
import { getAvisos } from '../services/api.js';

export default function InicioPage() {
    // ── Estado de cotizaciones ─────────────────────────────────────────────
    const [cotiz, setCotiz]             = useState(null);
    const [cotizLoading, setCotizLoading] = useState(true);

    // ── Estado de operaciones ──────────────────────────────────────────────
    const [operaciones, setOperaciones] = useState([]);
    const [opLoading, setOpLoading]     = useState(true);

    // ── Estado de avisos ───────────────────────────────────────────────────
    const [avisos, setAvisos]           = useState([]);
    const [avisosLoading, setAvisosLoading] = useState(true);

    const cargarCotizaciones = async () => {
        setCotizLoading(true);
        try {
            const d = await getCotizaciones();
            setCotiz(d);
        } catch (e) {
            console.error(e);
        } finally {
            setCotizLoading(false);
        }
    };

    useEffect(() => {
        cargarCotizaciones();

        getOperaciones()
            .then(setOperaciones)
            .catch(console.error)
            .finally(() => setOpLoading(false));

        getAvisos()
            .then((data) => {
                const arr = Array.isArray(data) ? data
                    : data?.data && Array.isArray(data.data) ? data.data : [];
                setAvisos(arr.slice(0, 4));
            })
            .catch(console.error)
            .finally(() => setAvisosLoading(false));
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar title="Inicio" />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                <Grid container spacing={2.5}>

                    {/* ═══ COLUMNA IZQUIERDA (sidebar) ═══ */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack spacing={2}>
                            <BienvenidaCard />
                            <ClimaWidget />
                            <AlertasWidget />
                        </Stack>
                    </Grid>

                    {/* ═══ COLUMNA PRINCIPAL ═══ */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    color="text.secondary"
                                    textTransform="uppercase"
                                    letterSpacing="0.05em"
                                    mb={1.5}
                                >
                                    Accesos rápidos
                                </Typography>
                                <AccesosRapidos />
                            </Box>

                            <CotizacionesWidget
                                cotiz={cotiz}
                                loading={cotizLoading}
                                onRefresh={cargarCotizaciones}
                            />

                            <OperacionesActivas
                                operaciones={operaciones}
                                loading={opLoading}
                            />

                            <AvisosRecientes
                                avisos={avisos}
                                loading={avisosLoading}
                            />
                        </Stack>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
}
