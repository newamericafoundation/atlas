Comp.Dashboard = React.createClass
	
	displayName: 'Dashboard'

	render: ->
		<div className='wrapper'>
			<div className={ 'header bg-c-naf-green' }>
				<div className="header__corner">
					<a className="bg-img-naf--off-white" id="header__welcome-link" href="/welcome" onClick={@navigate} />
				</div>
				<div className="header__main">
					<h1>NEW AMERICA</h1>
				</div>
				<Comp.SideBar />
			</div>
			<div className='dashboard bg-c--off-white'>
				<Comp.Floor plan={ @getFloorPlan() } />
				<div className='dashboard__welcome'>
					<h1>{ new Date().toISOString().slice(11, 16) }</h1>
					<p>Good afternoon, Anne-Marie!</p>
				</div>
			</div>
		</div>

	getFloorPlan: ->
		obj =
			name: '9th Floor'
			coordinates: [
				[ 5, 5 ]
				[ 150, 5 ]
				[ 150, 40 ]
				[ 300, 40 ]
				[ 300, 5 ]
				[ 400, 5 ]
				[ 400, 300 ]
				[ 5, 300 ]
			]
			rooms: [
				{
					name: 'A'
					coordinates: [
						[ 10, 10 ]
						[ 50, 10 ]
						[ 50, 40 ]
						[ 10, 40 ]
					]
				}
				{
					name: 'B'
					coordinates: [
						[ 10, 250 ]
						[ 50, 250 ]
						[ 50, 295 ]
						[ 10, 295 ]
					]
				}
				{
					name: 'C'
					coordinates: [
						[ 180, 45 ]
						[ 240, 45 ]
						[ 240, 80 ]
						[ 180, 80 ]
					]
				}
			]