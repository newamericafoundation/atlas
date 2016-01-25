import React from 'react'

import PatternsSetup from './patterns/root.jsx'
import ImagePreloader from './image_preloader/root.jsx'


export default class Setup extends React.Component {
	
	render() {
		return (
			<div className="atl__setup">
				<PatternsSetup {...this.props} size={30} />
				<ImagePreloader />
			</div>
		)
	}

}