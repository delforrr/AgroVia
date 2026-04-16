// Diálogo de confirmación genérico — reutilizable en TabUsuarios y TabAvisos.

import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * @param {boolean}  open        - Si está visible
 * @param {Function} onClose     - Cerrar sin confirmar
 * @param {Function} onConfirm   - Acción de confirmación
 * @param {string}   title       - Título del dialog
 * @param {string}   message     - Mensaje descriptivo
 * @param {string}   [confirmLabel] - Texto del botón confirmar
 * @param {string}   [confirmColor] - Color del botón ('error', 'success', etc.)
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    confirmColor = 'primary',
}) {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon color="warning" />
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2">{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor} sx={{ borderRadius: 3 }}>
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
