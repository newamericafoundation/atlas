import React from 'react';

class Modal extends React.Component {

	render() {
		return (
			<div className='modal'>
				<div className='modal__wrapper'>
					<div className='modal__content bg-c-off-white'>
						{ this.renderContent() }
					</div>
				</div>
			</div>
		);
	}

}

export default Modal;