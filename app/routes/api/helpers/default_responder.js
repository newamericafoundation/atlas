/*
 * Standard way to respond to a route that uses a crud middleware ()
 *
 */
export default function defaultResponder(req, res) {
	res.json(req.dbResponse)
}