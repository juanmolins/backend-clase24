import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para realizar el inicio de sesión utilizando sesiones
router.post('/login', passport.authenticate('local', {
  successRedirect: '/success', // Redirigir en caso de éxito
  failureRedirect: '/failure', // Redirigir en caso de fallo
}));

// Ruta para obtener el usuario actual
router.get('/current', (req, res) => {
  // Verificar si el usuario está autenticado
  if (req.isAuthenticated()) {
    res.json(req.user); // Enviar el usuario autenticado como respuesta
  } else {
    res.status(401).json({ message: 'No autorizado' }); // Responder con un estado 401 (No autorizado)
  }
});

export default router;