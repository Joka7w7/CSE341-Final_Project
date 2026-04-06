const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', commentsController.getAll);
router.get('/:id', commentsController.getSingle);
router.post('/', isAuthenticated, commentsController.createComment);
router.put('/:id', isAuthenticated, commentsController.updateComment);
router.delete('/:id', isAuthenticated, commentsController.deleteComment);

module.exports = router;