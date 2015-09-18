import React from 'react';
import Base from './base.jsx';

class ImageFile extends Base {

	render() {
		console.log(this.props.initialValue);
		return (
			<div className='form__wrapper'>

				<label>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					ref='input' 
					onChange={this.saveDataOnParent.bind(this)} 
					type='file'
					disabled={!this.props.isEnabled}
					name={this.props.id} 
					id={this.props.id} 
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	getDisplayStyle() {
		
	}

	saveDataOnParent(e) {

		var file = e.target.files[0];
		var reader = new FileReader();

		var removeBase64Header = function(s) {
			return s.slice(s.indexOf('base64') + 7);
		}

		reader.onload = () => { 
			var b64 = removeBase64Header(reader.result);
			this.props.saveDataOnParent({
				id: this.props.id,
				value: b64
			});
		};

		reader.readAsDataURL(file);

	}

}

export default ImageFile;