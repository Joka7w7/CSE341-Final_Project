const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send(req.session.user !== undefined
    ? `Logged in as ${req.session.user.displayName}`
    : 'Logged Out');
});

router.use('/users', require('./users'));
router.use('/projects', require('./projects'));
router.use('/tasks', require('./tasks'));
router.use('/comments', require('./comments'));

router.get('/login', passport.authenticate('github', { scope: ['user'] }), (req, res) => {});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;