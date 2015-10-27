// Uploads file to S3 bucket.

import React from 'react';
import Base from './base.jsx';

import $ from 'jquery';

class File extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			upload: 'initial'
		};
	}


	/*
	 *
	 *
	 */
	render() {
		if (FileReader == null) {
			return (<div className='form__wrapper'><p>This form component is not supported in your browser. Please reopen the file in a newer version of Chrome, Safari or Firefox.</p></div>);
		}
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<p className='form__hint'>{ this.state.upload }</p>
				<input 
					type='file'
					onChange={this.processUpload.bind(this)}
					disabled={!this.props.isEnabled}
					name={this.props.id}
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
	processUpload(e) {

		var file = e.target.files[0];

		var reader = new FileReader();

		var params = {
			Key: file.name, 
			ContentType: file.type
		};

		this.setState({
			upload: 'pending'
		});

		reader.onload = (res) => {

			params.Body = reader.result;

			$.ajax({
				url: '/static/upload',
				data: params,
				method: 'post',
				success: (data) => {
					this.setState({ upload: 'success' });
				},
				error: (data) => {
					this.setState({ upload: 'error' });
				}
			});

		};

		reader.readAsText(file);

	}

}

export default File;