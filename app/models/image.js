import * as base from './base.js'
import marked from 'marked'

export class Model extends base.Model {
	
	get resourceName() { return 'image'; }

	get defaults() {

		return {
			name: 'image',
			encoded: '',
			credit: ''
		};

	}


	get fields() {

		return [

			{
	            formComponentName: 'Text',
	            formComponentProps: {
	                id: 'name',
	                labelText: 'Image Name',
	                hint: 'Enter simple image name - no need to add a .jpg extension.',
	                placeholder: 'Enter Image Name'
	            }
	        },

	        {
	            formComponentName: 'ImageFile',
	            formComponentProps: {
	                id: 'encoded',
	                labelText: 'Direct image upload',
	                hint: 'Size limit: 3MB.'
	            }
	        },

	        {
	            formComponentName: 'Radio',
	            formComponentProps: {
	                id: 'stock_type',
	                labelText: 'Stock photo platform.',
	                options: [ 'shutterstock', 'unsplash' ],
	                hint: "Stock photo platform",
	                placeholder: 'Image Credit'
	            }
	        },

	        {
	            formComponentName: 'Text',
	            formComponentProps: {
	                id: 'stock_id',
	                labelText: 'Stock photo identifier.',
	                hint: "Stock photo id.",
	                placeholder: 'Id'
	            }
	        },

	        {
	            formComponentName: 'Upload',
	            formComponentProps: {
	                id: 'file',
	                labelText: 'Stock photo identifier.',
	                hint: "Upload file here.",
	                placeholder: 'Id'
	            }
	        }

		];

	}


	/*
	 *
	 *
	 */
	getViewUrl() {
		return null;
	}


	/*
	 * Gets encoded url to use as a CSS background-image. 
	 * 
	 */
	getUrl() {
		// if (this.get('stock_type') && this.get('stock_id')) {
		// 	return `url(/static/images/resize_cache--Stock_Photos--${this.get('stock_type')}_${this.get('stock_id')})`;
		// }
		var encoded;
		encoded = this.get('encoded');
		encoded = encoded.replace(/(\r\n|\n|\r)/gm, '');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	}


	/* 
	 * Gets html attribute.
	 *
	 */
	getAttributionHtml() {
		return marked(this.get('credit'));
	}

}


class Collection extends base.Collection {

	get model() { return Model }

}


export default {
	Model: Model,
	Collection: Collection
}