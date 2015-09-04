Comp.Projects.New = class extends React.Component {

	render() {
		var FormComp = Comp.Form;
		return (
			<div className='atl atl--explainer'>
				<div className='atl__main fill-parent'>

					<div className="atl__title-bar atl__title-bar--solid bg-c-off-white" ref='title-bar'>
						<div className="atl__title-bar__background" ref='title-bar__background'></div>
						<div className="atl__title-bar__content">
							<h1 className='title'>New Project</h1>
							<ul>
								<li>Updated: {  }</li>
							</ul>
						</div>
					</div>

					<div className="atl__content-bar bg-c-off-white"> 
						<div className="atl-grid">
							<div className="atl-grid__1-3">
								<div className="atl__page-nav" ref="page-nav">
									
								</div>
							</div>
							<div className="atl-grid__2-3">
								<div className="static-content">
									<FormComp Model={ window.M.project.Model } />
								</div>
								
							</div>
							<div className="atl-grid__3-3"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}