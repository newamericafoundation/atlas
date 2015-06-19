Comp.Projects.Show.Explainer = React.createClass
	render: ->
		<div className="fill-parent">
			<div className="atl__title-bar atl__title-bar--solid bg-c-off-white">
				<div className="atl__title-bar__background"></div>
				<div className="atl__title-bar__content">
					<h1 className='title'>{ @props.model.get 'title' }</h1>
					<ul>
						<li>Updated: { moment(@props.model.get('updated_at')).format("MMMM Do YYYY") }</li>
					</ul>
				</div>
			</div>
			<div className="atl__content-bar bg-c-off-white"> 
				<div className="atl-grid">
					<div className="atl-grid__1-3">
						<div className="atl__page-nav">
							<div className="atl__toc">
								<p>Page Contents</p>
								<div id="atl__toc__list">
									<div className="loading-icon"><div></div></div>
								</div>
							</div>
						</div>
					</div>
					<div className="atl-grid__2-3">
						<div className="static-content" dangerouslySetInnerHTML={{__html: @props.model.get('body_text')}}>
						</div>
						<div id="atl__related">
							<Comp.Projects.Show.Explainer.RelatedPages collection={@props.collection} />
						</div>
					</div>
					<div className="atl-grid__3-3"></div>
				</div>
			</div>
		</div>


Comp.Projects.Show.Explainer.RelatedPages = React.createClass
	getPages: ->
		console.log @props.collection
		@props.collection.map () ->
			<li></li>

	render: ->
		<div>
			<p>Related Pages</p>
			<ul>
				{ @getPages() }
			</ul>
		</div>