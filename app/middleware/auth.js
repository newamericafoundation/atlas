// Authentication middleware

/*
 * Simple route middleware to ensure user is authenticated.
 *   Use this route middleware on any resource that needs to be protected.  If
 *   the request is authenticated (typically via a persistent login session),
 *   the request will proceed.  Otherwise, the user will be redirected to the
 *   login page.
 */
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

/*
 * Ensure that an admin is authenticated.
 *
 */
export function ensureAdminAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user && req.user.isAdmin) {
		return next()
	}
	res.redirect('/login')
}


/*
 * Neutral placeholder middleware.
 *
 */
export function ensureNothing(req, res, next) {
    return next()
}