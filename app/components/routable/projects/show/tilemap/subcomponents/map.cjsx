Comp.Projects.Show.Tilemap.Map = React.createClass

	displayName: 'Comp.Projects.Show.Tilemap.Map'

	render: ->
		<div className="fill-parent" id="atl__map"></div>

	componentDidMount: ->
		App = @props.App
		return unless App?
		App.Tilemap.Map.Controller.show()

	componentWillUnmount: ->
		App = @props.App
		return unless App?
		App.Tilemap.Map.Controller.destroy()