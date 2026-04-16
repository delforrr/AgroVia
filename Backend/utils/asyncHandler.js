// Wrapper para manejar errores en route handlers async sin try/catch repetido.
// Captura cualquier excepción y la pasa al error handler global de Express.

/**
 * asyncHandler — envuelve una función async de Express
 * para que los errores no capturados lleguen al error middleware global.
 * @param {Function} fn - Route handler async
 */
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
