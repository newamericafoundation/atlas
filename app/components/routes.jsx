(function() {

var Router = ReactRouter,
	Route = ReactRouter.Route,
	RouteHandler = ReactRouter.RouteHandler,
	Setup = Comp.Setup,
	Header = Comp.Header,
	Welcome = Comp.Welcome,
	ProjectsIndex = Comp.Projects.Index,
	ProjectsShow = Comp.Projects.Show;

class Layout extends React.Component {

	render() {
		return (
			<div className='wrapper '>
				<Setup {...this.props} />
				<Header {...this.props} />
				<RouteHandler {...this.props} />
			</div>
		);
	}

}

var routes = (
	<Route handler={Layout}>
		<Route path='welcome' handler={Welcome} />
		<Route path='menu' handler={ProjectsIndex} />
		<Route path=':atlas_url' handler={ProjectsShow} a={'b'} />
	</Route>
);

Comp.start = () => {
	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		// var routeModifierClass = {
		// 	'/': 'atl-route--welcome',
		// 	'/menu': 'atl-route--projects-index',
		// 	'/welcome': 'atl-route--welcome'
		// }[state.path] || 'atl-route--projects-show';
		React.render(<Root App={Atlas} />, $('#site')[0]);
	});
};

}());