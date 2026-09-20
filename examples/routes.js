import express from 'express';
const router = express.Router();
const listUsers = (_req, res) => res.json([]);
const createUser = (_req, res) => res.status(201).json({ id: 1 });

router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', (_req, res) => res.sendStatus(204));
router.patch(
  '/users/:id',
  (_req, res) => res.sendStatus(204)
);
router.delete('/users/:id', (_req, res) => res.sendStatus(204));

router.route('/users')
  .get(listUsers)
  .post(createUser);

// These are ordinary collection operations, not HTTP requests.
const cache = new Map();
cache.get('/users');
cache.delete('/users');
export default router;
