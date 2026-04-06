const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', projectsController.getAll);
router.get('/:id', projectsController.getSingle);
router.post('/', isAuthenticated, projectsController.createProject);
router.put('/:id', isAuthenticated, projectsController.updateProject);
router.delete('/:id', isAuthenticated, projectsController.deleteProject);

module.exports = router;