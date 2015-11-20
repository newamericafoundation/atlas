import express from 'express'
import passport from 'passport'

var router = express.Router()

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
    passport.authenticate('google', {
        scope: [ 'profile', 'email' ]
    }),
    function(req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    })

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    function(req, res) {
        // req.session.accessToken = req.user.accessToken;
        res.redirect('/')
    });

export default router