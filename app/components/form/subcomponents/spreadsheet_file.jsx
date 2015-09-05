import React from 'react';

class SpreadsheetFile extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					ref='input' 
					onChange={this.sendData.bind(this)} 
					type='file' 
					name={this.props.id} 
					id={this.props.id} 
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	parseWorkBook(workbook) {
		var obj = {};
		console.log(workbook);
		for (let sheetName in workbook.Sheets) {
			let sheet = workbook.Sheets[sheetName];
			obj[sheetName] = XLSX.utils.sheet_to_json(sheet, { raw: true });
		}
		return obj;
	}

	sendData(e) {

		var file = e.target.files[0];
		var reader = new FileReader();

		reader.onload = () => { 
			var bstr = reader.result;
			var workbook = XLSX.read(bstr, { type: 'binary' });
			this.props.sendData({
				id: this.props.id,
				value: this.parseWorkBook(workbook)
			});
		};

		reader.readAsBinaryString(file);

	}

}

export default SpreadsheetFile;