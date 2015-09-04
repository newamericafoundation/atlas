(function() {

var Router = ReactRouter,
	Route = ReactRouter.Route,
	RouteHandler = ReactRouter.RouteHandler,
	Setup = Comp.Setup,
	Header = Comp.Header,
	Welcome = Comp.Welcome,
	ProjectsIndex = Comp.Projects.Index,
	ProjectsShow = Comp.Projects.Show,
	ProjectsNew = Comp.Projects.New;

class Layout extends React.Component {

	render() {
		return (
			<div className='wrapper'>
				<Setup {...this.props} />
				<Header {...this.props} />
				<RouteHandler {...this.props} />
			</div>
		);
	}

}

var routes = (
	<Route handler={Layout}>
		<Route path='' handler={Welcome} />
		<Route path='projects'>
			<Route path='new' handler={ProjectsNew} />
		</Route>
		<Route path='welcome' handler={Welcome} />
		<Route path='menu' handler={ProjectsIndex} />
		<Route path=':atlas_url' handler={ProjectsShow} />
	</Route>
);

Comp.start = () => {
	console.log('Hi, Mom!');
	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		React.render(<Root App={Atlas} />, $('#site')[0]);
	});
};

}());