import React from 'react';

class Text extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					type='text' 
					onChange={this.saveDataOnParent.bind(this)} 
					name={this.props.id}
					id={this.props.id}
					value={this.props.initialValue}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	saveDataOnParent(e) {
		console.log(e.target.value);
		this.props.saveDataOnParent({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default Text;