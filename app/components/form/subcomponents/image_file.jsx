import React from 'react'


export default class ImageFile extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>

				<label htmlFor={this.props.id}>{ this.props.labelText }</label>
				{ this.renderThumbnail() }
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
		)
	}

	renderThumbnail() {
		var encoded = this.props.initialValue;
		if (encoded) {
			encoded = encoded.replace(/(\r\n|\n|\r)/gm, '');
			return (
				<div style={{ width: '100%', paddingTop: '75%', backgroundSize: 'cover', backgroundImage: ("url('data:image/png;base64," + encoded + "')") }} />
			)
		}
	}

	saveDataOnParent(e) {

		var file = e.target.files[0]
		var reader = new FileReader()

		function removeBase64Header(imageDataUrl) {
			return imageDataUrl.slice(imageDataUrl.indexOf('base64') + 7)
		}

		reader.onload = () => { 
			var b64 = removeBase64Header(reader.result);
			this.props.saveDataOnParent({
				id: this.props.id,
				value: b64
			})
		}

		reader.readAsDataURL(file)

	}

}