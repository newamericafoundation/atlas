var base = require('./base.js');

exports.Model = base.Model.extend({
	
	name: 'image',

	defaults: {

		name: 'image',
		encoded: '',
		credit: ''

	},

	fields: [

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

	],

	apiUrlRoot: '/api/v1/images',

	getEditUrl: function() {
		return `/images/${this.get('id')}/edit`;
	},

	getViewUrl: function() {
		return '/';
	},

	/**
	 * Recognize and process server response.
	 * @param {object} resp - Server response.
	 * @return {object} resp - Modified response.
	 */
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},

	/** Gets encoded url to use as a CSS background-image. */
	getUrl: function() {
		var encoded;
		encoded = this.get('encoded');
		encoded = encoded.replace(/(\r\n|\n|\r)/gm, '');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},

	/** Gets html attribute. */
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}

});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	apiUrl: '/api/v1/images'

});