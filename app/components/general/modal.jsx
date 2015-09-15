import React from 'react';

class Modal extends React.Component {

	render() {
		return (
			<div className='modal'>
				<div className='modal__wrapper'>
					<div className='modal__window bg-c-off-white'>
						<div className='modal__content'>
							<div>
								{ this.renderContent() }
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default Modal;