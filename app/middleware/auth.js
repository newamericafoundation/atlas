export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

export function ensureAdminAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user && req.user.isAdmin) {
		return next()
	}
	res.redirect('/login')
}

export function ensureNothing(req, res, next) {
    return next()
}