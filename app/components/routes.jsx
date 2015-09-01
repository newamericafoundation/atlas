(function() {

var Route = ReactRouter.Route,
	RouteHandler = ReactRouter.RouteHandler,
	Setup = Comp.Setup,
	Header = Comp.Header;

class Layout extends React.Component {

	render() {
		return (
			<div className='wrapper'>
				<Setup {...this.props} />
				<Header {...this.props} />
			</div>
		);
	}

}

Comp.routes = (
	<Route handler={Layout}>
		<Route path='welcome' handler={''} />
	</Route>
);

}());