import base from './base.js';
import marked from 'marked';

class Model extends base.Model {
	
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
	            id: 'name',
	            formComponentName: 'Text',
	            formComponentProps: {
	                id: 'name',
	                labelText: 'Image Name',
	                hint: 'Enter simple image name - no need to add a .jpg extension.',
	                placeholder: 'Enter Image Name'
	            }
	        },

	        {
	            id: 'encoded',
	            formComponentName: 'ImageFile',
	            formComponentProps: {
	                id: 'encoded',
	                labelText: 'Image File',
	                hint: 'Size limit: 3MB.'
	            }
	        },

	        {
	            id: 'credit',
	            formComponentName: 'Text',
	            formComponentProps: {
	                id: 'credit',
	                labelText: 'Image Credit',
	                hint: "Single URL or Markdown, e.g. '[Shutterstock](http://www.shutterstock.com/imageurl)'",
	                placeholder: 'Image Credit'
	            }
	        }

		];

	}


	getEditUrl() {
		return `/images/${this.get('id')}/edit`;
	}


	getViewUrl() {
		return '/';
	}


	/** Gets encoded url to use as a CSS background-image. */
	getUrl() {
		var encoded;
		encoded = this.get('encoded');
		encoded = encoded.replace(/(\r\n|\n|\r)/gm, '');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	}


	/** Gets html attribute. */
	getAttributionHtml() {
		return marked(this.get('credit'));
	}

}

class Collection extends base.Collection {

	get model() { return Model; }

}


export default {
	Model: Model,
	Collection: Collection
}