import React from 'react'
import ReactDOM from 'react-dom'

import Base from './base.jsx'

class SelectizeText extends Base {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					ref='input' 
					type='text' 
					name={this.props.id} 
					disabled={!this.props.isEnabled}
					id={this.props.id}
					value={this.props.initialValue}
					placeholder={this.props.placeholder}
				/>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		var $el = $(ReactDOM.findDOMNode(this.refs.input));
		$el.selectize({
			delimiter: ',',
			persist: true,
			create: function(input) {
				return { value: input, text: input };
			}
		}).on('change', this.saveDataOnParent.bind(this));
	}


	/*
	 *
	 *
	 */
	componentWillUnmount() {
		var $el = $(ReactDOM.findDOMNode(this.refs.input));
		$el[0].selectize.destroy();
	}


	/*
	 *
	 *
	 */
	saveDataOnParent(e) {
		this.props.saveDataOnParent({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default SelectizeText;