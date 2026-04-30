import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import { useAvisos } from "../hooks/useAvisos";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const CAMPOS_CATEGORIA = {
    'Hacienda': [
        { name: 'tipo_animal', label: 'Tipo de Animal', required: true, placeholder: 'Novillos, Vacas, etc.' },
        { name: 'condicion', label: 'Condición', required: true, placeholder: 'Invernada, Cría, etc.' },
        { name: 'cantidad_cabezas', label: 'Cantidad de Cabezas', type: 'number' },
        { name: 'peso_promedio_kg', label: 'Peso Promedio (kg)', type: 'number' },
        { name: 'edad_meses', label: 'Edad (meses)', type: 'number' },
        { name: 'sanidad', label: 'Sanidad' },
    ],
    'Maquinaria': [
        { name: 'tipo_maquinaria', label: 'Tipo de Maquinaria', required: true, placeholder: 'Tractor, Cosechadora, etc.' },
        { name: 'marca', label: 'Marca', required: true },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'anio', label: 'Año', type: 'number' },
        { name: 'horas_uso', label: 'Horas de Uso', type: 'number' },
        { name: 'potencia_cv', label: 'Potencia (CV)', type: 'number' },
        { name: 'traccion', label: 'Tracción', placeholder: '4x4, 4x2, etc.' },
    ],
    'Granos': [
        { name: 'cultivo', label: 'Cultivo', required: true, placeholder: 'Soja, Maíz, Trigo, etc.' },
        { name: 'cantidad_tn', label: 'Cantidad (Toneladas)', type: 'number' },
        { name: 'humedad', label: 'Humedad (%)' },
        { name: 'proteina', label: 'Proteína (%)' },
        { name: 'grado_calidad', label: 'Grado de Calidad', placeholder: 'Grado 1, 2, etc.' },
        { name: 'disponibilidad_fecha', label: 'Fecha Disponibilidad', type: 'date' },
    ],
    'Servicios': [
        { name: 'tipo_servicio', label: 'Tipo de Servicio', required: true, placeholder: 'Cosecha, Siembra, Transporte, etc.' },
        { name: 'modalidad', label: 'Modalidad', required: true, placeholder: 'Por hectárea, por viaje, etc.' },
        { name: 'disponibilidad', label: 'Disponibilidad' },
        { name: 'area_cobertura', label: 'Área de Cobertura' },
        { name: 'unidad_precio', label: 'Unidad de Precio', placeholder: '$/ha, $/km, etc.' },
    ],
};


export default function PublicarAvisoPage({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Seleccionar Categoría", "Completar Datos", "Subir Imagen"];
  const { agregarAviso } = useAvisos();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navbar title="Publica tu Aviso" />

      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}></Grid>
      </Grid>

      <Box component="main" sx={{ p: 2, py: 3 }}></Box>
    </Box>
  );
}
