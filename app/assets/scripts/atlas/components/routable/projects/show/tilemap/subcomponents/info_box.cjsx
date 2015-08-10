Comp.Projects.Show.Tilemap.InfoBox = React.createClass

	render: ->
		<div className="atl__info-box">

			<a href="#" className="bg-img-no--black atl__info-box__close"></a>

			<div className="atl__title-bar atl__title-bar--image bg-c-off-white">

				<div className="atl__title-bar__background"></div>

				<div className="atl__title-bar__content">
					<h1 className='title'>{ 'Name or Title' }</h1>
					<ul>

						{ @renderWebsite() }

					</ul>
				</div>

			</div>

			<div className="atl__content-bar bg-c-off-white">

				<div className="atl-grid">

					<div className="atl-grid__1-3">
						<div className="atl__page-nav">
							<div className="atl__toc">
								<p>Page Contents</p>
								<div id="atl__toc__list"></div>
							</div>
							<div id="atl__related"></div>
						</div>
					</div>

					<div className="atl-grid__2-3">

						<div className="static-content">
							{ 'Body Text' }
						</div>
					</div>

					<div className="atl-grid__3-3">
					</div>

				</div>

			</div>

		</div>


	renderWebsite: ->
		# <% website = @state_website or @website %>
		# <% if website?: %>

		<li>
			<a className="icon-button" href="<%= website %>" target="_blank">
				<div className="icon-button__icon bg-img-link--black"></div>
				<div className="icon-button__text">Website</div>
			</a>
		</li>