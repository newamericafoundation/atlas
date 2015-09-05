import React from 'react';

class Text extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					type='text' 
					onChange={this.sendData.bind(this)} 
					name={this.props.id}
					id={this.props.id}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	sendData(e) {
		this.props.sendData({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default Text;