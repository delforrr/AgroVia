// Servicio de operaciones para el sector agropecuario

const simularLatencia = (ms = 700) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const ESTADOS_OPERACION = {
    INICIADA: 'Iniciada',
    EN_REVISION: 'En revisión',
    DOCUMENTACION: 'Documentación',
    FIRMADA: 'Firmada',
    CERRADA: 'Cerrada',
    CANCELADA: 'Cancelada',
};

export const PASO_IDX = {
    [ESTADOS_OPERACION.INICIADA]: 0,
    [ESTADOS_OPERACION.EN_REVISION]: 1,
    [ESTADOS_OPERACION.DOCUMENTACION]: 2,
    [ESTADOS_OPERACION.FIRMADA]: 3,
    [ESTADOS_OPERACION.CERRADA]: 4,
};

const DOCUMENTOS_GRANOS = [
    { id: 'doc_contrato',     label: 'Contrato de compraventa',      requerido: true  },
    { id: 'doc_analisis',     label: 'Análisis de calidad de grano', requerido: true  },
    { id: 'doc_remito',       label: 'Remito de traslado',           requerido: true  },
    { id: 'doc_factura',      label: 'Factura A o B',                requerido: true  },
    { id: 'doc_senasa',       label: 'Certificado SENASA',           requerido: false },
    { id: 'doc_seguro',       label: 'Póliza de seguro de carga',    requerido: false },
];

const DOCUMENTOS_HACIENDA = [
    { id: 'doc_dta',          label: 'DTA (Documento de Tránsito Animal)', requerido: true  },
    { id: 'doc_vacunacion',   label: 'Certificado de vacunación',          requerido: true  },
    { id: 'doc_faena',        label: 'Guía de faena / tropa',              requerido: true  },
    { id: 'doc_factura',      label: 'Factura A o B',                      requerido: true  },
    { id: 'doc_senasa_h',     label: 'Habilitación SENASA del predio',     requerido: true  },
    { id: 'doc_sangre',       label: 'Análisis de sangre / brucelosis',    requerido: false },
];

const DOCUMENTOS_MAQUINARIA = [
    { id: 'doc_factura',      label: 'Factura A o B',                     requerido: true  },
    { id: 'doc_titulo',       label: 'Título de propiedad / escritura',    requerido: true  },
    { id: 'doc_vtv',          label: 'VTV / Revisión técnica',             requerido: false },
    { id: 'doc_seguro',       label: 'Seguro de maquinaria',               requerido: false },
    { id: 'doc_contrato',     label: 'Contrato de compraventa',            requerido: true  },
];

const mock_operaciones = [
    {
        id: 'OP-2024-001',
        tipo: 'Granos',
        titulo: 'Compra de Soja — 150 tn',
        descripcion: 'Negociación de 150 toneladas de soja de primera calidad. Calidad requerida: humedad máx. 13.5%, materia extraña máx. 1%.',
        estado: ESTADOS_OPERACION.DOCUMENTACION,
        monto: 46_500_000,
        moneda: 'ARS',
        comprador: { nombre: 'Agropecuaria Don José S.A.', cuit: '30-71234567-1', localidad: 'Córdoba', avatar: '🏢' },
        vendedor: { nombre: 'Granos del Sur S.R.L.',        cuit: '30-65432198-4', localidad: 'Rosario', avatar: '🌾' },
        fechaInicio: '2024-03-10',
        entrega: '2024-04-15',
        documentos: DOCUMENTOS_GRANOS.map((d, i) => ({ ...d, completado: i < 3 })),
    },
    {
        id: 'OP-2024-002',
        tipo: 'Hacienda',
        titulo: 'Venta de novillos — 80 cabezas',
        descripcion: 'Lote de 80 novillos Aberdeen Angus de 400–480 kg, entrega en campo. Precio acordado a $3.900/kg vivo.',
        estado: ESTADOS_OPERACION.FIRMADA,
        monto: 12_480_000,
        moneda: 'ARS',
        comprador: { nombre: 'Frigorífico Pampeano S.A.', cuit: '30-55512399-7', localidad: 'La Pampa', avatar: '🏭' },
        vendedor: { nombre: 'Estancia El Ombú',           cuit: '20-30456789-3', localidad: 'Buenos Aires', avatar: '🐄' },
        fechaInicio: '2024-03-01',
        entrega: '2024-03-28',
        documentos: DOCUMENTOS_HACIENDA.map((d, i) => ({ ...d, completado: i < 5 })),
    },
    {
        id: 'OP-2024-003',
        tipo: 'Maquinaria',
        titulo: 'Adquisición de Cosechadora John Deere S770',
        descripcion: 'Cosechadora 2021, 1.200 horas de uso, en perfecto estado. Precio acordado USD 145.000.',
        estado: ESTADOS_OPERACION.EN_REVISION,
        monto: 145_000,
        moneda: 'USD',
        comprador: { nombre: 'Campo San Martín S.A.',        cuit: '30-70012345-5', localidad: 'Entre Ríos', avatar: '👨‍🌾' },
        vendedor: { nombre: 'Maquinaria González e Hijos', cuit: '20-25678901-4', localidad: 'Santiago del Estero', avatar: '🚜' },
        fechaInicio: '2024-03-18',
        entrega: '2024-04-30',
        documentos: DOCUMENTOS_MAQUINARIA.map((d, i) => ({ ...d, completado: i < 1 })),
    },
    {
        id: 'OP-2024-004',
        tipo: 'Granos',
        titulo: 'Compra de Maíz — 300 tn',
        descripcion: 'Compra de 300 toneladas de maíz amarillo para feed. Entrega en acopio partido de Venado Tuerto.',
        estado: ESTADOS_OPERACION.CERRADA,
        monto: 65_400_000,
        moneda: 'ARS',
        comprador: { nombre: 'Avícola San Isidro S.A.',    cuit: '30-49876543-2', localidad: 'Santa Fe', avatar: '🐔' },
        vendedor: { nombre: 'Cooperativa Agropecuaria La Unión', cuit: '30-71112233-8', localidad: 'Santa Fe', avatar: '🌽' },
        fechaInicio: '2024-02-01',
        entrega: '2024-02-28',
        documentos: DOCUMENTOS_GRANOS.map((d) => ({ ...d, completado: true })),
    },
    {
        id: 'OP-2024-005',
        tipo: 'Hacienda',
        titulo: 'Recría de terneros — 120 cabezas',
        descripcion: 'Servicio de recría de 120 terneros cruza por período de 6 meses. Peso de ingreso: 180 kg promedio.',
        estado: ESTADOS_OPERACION.INICIADA,
        monto: 3_600_000,
        moneda: 'ARS',
        comprador: { nombre: 'Juan Carlos García',    cuit: '20-27654321-1', localidad: 'Córdoba', avatar: '👤' },
        vendedor: { nombre: 'Campo Los Álamos',       cuit: '20-18765432-9', localidad: 'Córdoba', avatar: '🐮' },
        fechaInicio: '2024-04-01',
        entrega: '2024-10-01',
        documentos: DOCUMENTOS_HACIENDA.map((d, i) => ({ ...d, completado: i === 0 })),
    },
];

// ── Exports ────────────────────────────────────────────────────────────
export const getOperaciones = async () => {
    await simularLatencia(700 + Math.random() * 300);
    return [...mock_operaciones];
};

export const getOperacionById = async (id) => {
    await simularLatencia(300);
    return mock_operaciones.find((op) => op.id === id) ?? null;
};

export const toggleDocumento = async (opId, docId) => {
    await simularLatencia(200);
    const op = mock_operaciones.find((o) => o.id === opId);
    if (!op) throw new Error('Operación no encontrada');
    const doc = op.documentos.find((d) => d.id === docId);
    if (doc) doc.completado = !doc.completado;
    return op;
};
