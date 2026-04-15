// Página de inicio de la aplicación

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Skeleton,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Leaf } from "@boxicons/react";

// Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GrainIcon from "@mui/icons-material/Grain";
import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ArticleIcon from "@mui/icons-material/Article";
import StoreIcon from "@mui/icons-material/Store";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PersonIcon from "@mui/icons-material/Person";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import Navbar from "../components/layout/Navbar.jsx";
import { getCotizaciones } from "../services/cotizacionesService.js";
import {
  getOperaciones,
  ESTADOS_OPERACION,
} from "../services/operacionesService.js";
import { getAvisos } from "../services/api.js";

// Helpers
const fmt = (n) => n?.toLocaleString("es-AR") ?? "—";
const fmtMonto = (m, mon) => (mon === "USD" ? `USD ${fmt(m)}` : `$${fmt(m)}`);

// Chip de variación
function VarChip({ pct }) {
  if (pct == null) return null;
  const up = pct >= 0;
  return (
    <Chip
      size="small"
      icon={
        up ? (
          <TrendingUpIcon sx={{ fontSize: "14px !important" }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: "14px !important" }} />
        )
      }
      label={`${up ? "+" : ""}${pct}%`}
      sx={{
        height: 20,
        fontSize: "0.7rem",
        fontWeight: 700,
        bgcolor: up ? "#e8f5e9" : "#fce4ec",
        color: up ? "#2e7d32" : "#c62828",
        "& .MuiChip-icon": { color: "inherit" },
      }}
    />
  );
}

// Acceso rápido card
function QuickCard({ icon, label, sublabel, color, to, onClick }) {
  return (
    <Card
      elevation={0}
      sx={{
        flex: "1 1 130px",
        border: "1px solid rgba(0,0,0,0.09)",
        borderRadius: 3,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": { boxShadow: 4, transform: "translateY(-3px)" },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2, height: "100%" }}>
        <Avatar
          sx={{ bgcolor: `${color}20`, color, width: 44, height: 44, mb: 1.5 }}
        >
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

// Estado chip de operación
const ESTADO_CFG = {
  Iniciada: { color: "#1976d2", bg: "#e3f2fd" },
  "En revisión": { color: "#f57c00", bg: "#fff3e0" },
  Documentación: { color: "#7b1fa2", bg: "#f3e5f5" },
  Firmada: { color: "#2e7d32", bg: "#e8f5e9" },
  Cerrada: { color: "#546e7a", bg: "#eceff1" },
  Cancelada: { color: "#c62828", bg: "#fce4ec" },
};
function EstadoChip({ estado }) {
  const cfg = ESTADO_CFG[estado] ?? { color: "#333", bg: "#eee" };
  return (
    <Chip
      size="small"
      label={estado}
      sx={{
        fontWeight: 700,
        fontSize: "0.7rem",
        color: cfg.color,
        bgcolor: cfg.bg,
        border: `1px solid ${cfg.color}30`,
      }}
    />
  );
}

// Clima mock
const CLIMA_MOCK = [
  {
    dia: "Hoy",
    temp: "24°C",
    icon: <WbSunnyIcon sx={{ color: "#f9a825" }} />,
    desc: "Soleado",
    humedad: "45%",
  },
  {
    dia: "Mañana",
    temp: "19°C",
    icon: <CloudIcon sx={{ color: "#78909c" }} />,
    desc: "Nublado",
    humedad: "60%",
  },
  {
    dia: "Pasado",
    temp: "15°C",
    icon: <WaterDropIcon sx={{ color: "#1976d2" }} />,
    desc: "Lluvia",
    humedad: "85%",
  },
];

// Notificaciones mock
const NOTIFS = [
  {
    id: 1,
    texto: "Tu operación OP-2024-001 requiere documentación.",
    tipo: "warning",
    hace: "2h",
  },
  {
    id: 2,
    texto: "La cotización de Soja subió un 2.1% hoy.",
    tipo: "info",
    hace: "4h",
  },
  {
    id: 3,
    texto: "Nuevo aviso de Hacienda en Córdoba disponible.",
    tipo: "info",
    hace: "6h",
  },
];

export default function InicioPage() {
  const navigate = useNavigate();

  // Estado cotizaciones
  const [cotiz, setCotiz] = useState(null);
  const [cotizLoading, setCotizLoading] = useState(true);

  // Estado operaciones
  const [operaciones, setOperaciones] = useState([]);
  const [opLoading, setOpLoading] = useState(true);

  // Estado avisos
  const [avisos, setAvisos] = useState([]);
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
        const arr = Array.isArray(data)
          ? data
          : data?.data && Array.isArray(data.data)
            ? data.data
            : [];
        setAvisos(arr.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setAvisosLoading(false));
  }, []);

  // Cotizaciones destacadas: top 3 granos
  const granosDestacados = cotiz?.granos?.slice(0, 4) ?? [];
  // Operaciones activas (no cerradas/canceladas)
  const opActivas = operaciones
    .filter(
      (o) =>
        ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(
          o.estado,
        ),
    )
    .slice(0, 3);

  const progreso = (docs) => {
    if (!docs?.length) return 0;
    return Math.round(
      (docs.filter((d) => d.completado).length / docs.length) * 100,
    );
  };

  // Accesos rápidos
  const accesos = [
    {
      icon: <StoreIcon />,
      label: "Avisos",
      sublabel: "Ver publicaciones",
      color: "#6A8E5E",
      to: "/avisos",
    },
    {
      icon: <ShowChartIcon />,
      label: "Mercado",
      sublabel: "Cotizaciones",
      color: "#1565c0",
      to: "/mercado",
    },
    {
      icon: <HandshakeIcon />,
      label: "Operaciones",
      sublabel: "Negociaciones",
      color: "#7b1fa2",
      to: "/operaciones",
    },
    {
      icon: <PersonIcon />,
      label: "Mi Perfil",
      sublabel: "Cuenta y datos",
      color: "#A0785E",
      to: "/perfil",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Navbar title="Inicio" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2.5}>
          {/* ═══ COLUMNA IZQUIERDA (sidebar info) ═══ */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={2}>
              {/* Bienvenida */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  background:
                    "linear-gradient(145deg, #4a7c3f 0%, #6A8E5E 60%, #8ab87a 100%)",
                  p: 2.5,
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* decorative circle */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.08)",
                  }}
                />
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Leaf fill="#8adc6f" width={28} height={28} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ opacity: 0.9 }}
                  >
                    AgroVía
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  lineHeight={1.2}
                  mb={0.5}
                >
                  ¡Bienvenido! 👋
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Hoy es un buen día para el campo.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.6, display: "block", mt: 1 }}
                >
                  {new Date().toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </Typography>
              </Paper>

              {/* Clima */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
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
                          <Typography variant="body2" fontWeight={600}>
                            {c.dia}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.desc} · 💧{c.humedad}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="text.primary"
                      >
                        {c.temp}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              {/* Notificaciones */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <NotificationsNoneIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.05em"
                    >
                      Alertas
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    label={NOTIFS.length}
                    color="primary"
                    sx={{ height: 18, fontSize: "0.68rem" }}
                  />
                </Stack>
                <Stack spacing={1.5}>
                  {NOTIFS.map((n) => (
                    <Box
                      key={n.id}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: (t) =>
                          n.tipo === "warning"
                            ? t.palette.mode === "dark"
                              ? alpha(t.palette.warning.main, 0.15)
                              : "#fff8e1"
                            : t.palette.mode === "dark"
                              ? alpha(t.palette.info.main, 0.15)
                              : "#f3f8ff",
                        borderLeft: 3,
                        borderLeftStyle: "solid",
                        borderLeftColor:
                          n.tipo === "warning" ? "warning.main" : "info.main",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.primary"
                        display="block"
                        lineHeight={1.4}
                      >
                        {n.texto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        hace {n.hace}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* ═══ COLUMNA PRINCIPAL (contenido) ═══ */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={2.5}>
              {/* Accesos rápidos */}
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
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {accesos.map((a) => (
                    <QuickCard
                      key={a.label}
                      {...a}
                      onClick={() => navigate(a.to)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Cotizaciones destacadas */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2.5, pt: 2, pb: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShowChartIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Cotizaciones del día
                    </Typography>
                    <Chip
                      size="small"
                      label="Granos · Rosario"
                      variant="outlined"
                      sx={{ fontSize: "0.68rem" }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Actualizar">
                      <IconButton
                        size="small"
                        onClick={cargarCotizaciones}
                        disabled={cotizLoading}
                        sx={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: 1.5,
                        }}
                      >
                        <RefreshIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/mercado")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      Ver mercado
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid container sx={{ px: 0.5, py: 1 }}>
                  {cotizLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Grid key={i} size={{ xs: 6, sm: 3 }} sx={{ p: 1.5 }}>
                          <Skeleton variant="text" width="60%" height={14} />
                          <Skeleton
                            variant="text"
                            width="80%"
                            height={28}
                            sx={{ mt: 0.5 }}
                          />
                          <Skeleton
                            variant="rounded"
                            width={60}
                            height={20}
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                      ))
                    : granosDestacados.map((g, i) => (
                        <Grid
                          key={g.id}
                          size={{ xs: 6, sm: 3 }}
                          sx={{
                            p: 1.5,
                            borderRight:
                              i < 3 ? "1px solid rgba(0,0,0,0.06)" : "none",
                            "&:nth-of-type(2)": {
                              borderRight: {
                                xs: "none",
                                sm: "1px solid rgba(0,0,0,0.06)",
                              },
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            mb={0.5}
                          >
                            <GrainIcon
                              sx={{ fontSize: 13, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight={600}
                            >
                              {g.nombre}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="primary.main"
                            lineHeight={1}
                          >
                            ${fmt(g.precio)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            mb={0.5}
                          >
                            {g.unidad}
                          </Typography>
                          <VarChip pct={g.var_pct} />
                        </Grid>
                      ))}
                </Grid>

                {/* Divisas rápidas */}
                {!cotizLoading && cotiz?.divisas && (
                  <>
                    <Divider />
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      gap={0}
                      sx={{ px: 2, py: 1.5 }}
                    >
                      {cotiz.divisas.slice(0, 4).map((d) => (
                        <Stack
                          key={d.id}
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          sx={{ mr: 2.5, my: 0.25 }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {d.nombre}:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="text.primary"
                          >
                            ${fmt(d.precio)}
                          </Typography>
                          <VarChip pct={d.var_pct} />
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}
              </Paper>

              {/* Operaciones activas */}
              <Paper
                elevation={0}
                sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2.5, pt: 2, pb: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HandshakeIcon sx={{ color: "#7b1fa2", fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Operaciones activas
                    </Typography>
                    {!opLoading && (
                      <Chip
                        size="small"
                        label={opActivas.length}
                        sx={{
                          height: 18,
                          fontSize: "0.68rem",
                          bgcolor: "#f3e5f5",
                          color: "#7b1fa2",
                        }}
                      />
                    )}
                  </Stack>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/operaciones")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    Ver todas
                  </Button>
                </Stack>
                <Divider />

                {opLoading ? (
                  <Stack spacing={1.5} sx={{ p: 2 }}>
                    {[1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1.5,
                          border: "1px solid rgba(0,0,0,0.07)",
                          borderRadius: 2,
                        }}
                      >
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="30%" height={12} />
                        <Skeleton variant="rounded" height={5} sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                ) : opActivas.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No tenés operaciones activas
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={0} divider={<Divider />}>
                    {opActivas.map((op) => {
                      const pct = progreso(op.documentos);
                      return (
                        <Box
                          key={op.id}
                          sx={{
                            px: 2.5,
                            py: 1.75,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                            transition: "background 0.15s",
                          }}
                          onClick={() => navigate("/operaciones")}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={1}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={0.5}
                                flexWrap="wrap"
                              >
                                <Chip
                                  size="small"
                                  icon={
                                    op.tipo === "Granos" ? (
                                      <GrainIcon />
                                    ) : op.tipo === "Hacienda" ? (
                                      <PetsIcon />
                                    ) : (
                                      <AgricultureIcon />
                                    )
                                  }
                                  label={op.tipo}
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.68rem",
                                    height: 20,
                                    "& .MuiChip-icon": { fontSize: 12 },
                                  }}
                                />
                                <EstadoChip estado={op.estado} />
                              </Stack>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                              >
                                {op.titulo}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="primary.main"
                              sx={{ ml: 1, whiteSpace: "nowrap" }}
                            >
                              {fmtMonto(op.monto, op.moneda)}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <ArticleIcon
                              sx={{ fontSize: 13, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ minWidth: 110 }}
                            >
                              Doc:{" "}
                              {op.documentos.filter((d) => d.completado).length}
                              /{op.documentos.length}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{
                                  height: 4,
                                  borderRadius: 4,
                                  bgcolor: "rgba(0,0,0,0.07)",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor:
                                      pct === 100 ? "#2e7d32" : "primary.main",
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {pct}%
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Paper>

              {/* Avisos recientes */}
              <Paper
                elevation={0}
                sx={{ borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2.5, pt: 2, pb: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StoreIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Avisos recientes
                    </Typography>
                  </Stack>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/avisos")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    Ver todos
                  </Button>
                </Stack>
                <Divider />

                {avisosLoading ? (
                  <Stack spacing={1.5} sx={{ p: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5 }}>
                        <Skeleton variant="rounded" width={52} height={52} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="40%" height={12} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : avisos.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sin avisos disponibles
                    </Typography>
                  </Box>
                ) : (
                  <Stack divider={<Divider />}>
                    {avisos.map((av) => (
                      <Stack
                        key={av.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{
                          px: 2.5,
                          py: 1.5,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                          transition: "background 0.15s",
                        }}
                        onClick={() => navigate("/avisos")}
                      >
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor:
                              av.categoria === "Hacienda"
                                ? "#e8f5e9"
                                : av.categoria === "Maquinaria"
                                  ? "#e3f2fd"
                                  : "#fff8e1",
                            fontSize: "1.3rem",
                          }}
                        >
                          {av.categoria === "Hacienda"
                            ? "🐄"
                            : av.categoria === "Maquinaria"
                              ? "🚜"
                              : av.categoria === "Granos"
                                ? "🌾"
                                : "🔧"}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {av.titulo}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Chip
                              size="small"
                              label={av.categoria}
                              sx={{
                                height: 16,
                                fontSize: "0.65rem",
                                fontWeight: 600,
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              📍 {av.localidad}, {av.provincia}
                            </Typography>
                          </Stack>
                        </Box>
                        {av.precio && (
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="primary.main"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            ${fmt(av.precio)}
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
