import React from 'react'

import PatternsSetup from './patterns/root.jsx'


/*
 *
 *
 */
class Setup extends React.Component {
	
	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="atl__setup">
				<PatternsSetup {...this.props} size={30} />
			</div>
		)
	}

}

export default Setup