export function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
}

export function requireClient(req, res, next) {
  if (req.user && (req.user.role === 'client' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado.' });
  }
}

export function checkClientAccess(req, res, next) {
  const requestedClientId = parseInt(req.params.clientId);

  if (req.user.role === 'admin') {
    next();
  } else if (req.user.id === requestedClientId) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Você só pode acessar seus próprios dados.' });
  }
}

export default { requireAdmin, requireClient, checkClientAccess };
