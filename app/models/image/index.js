import * as base from './../base.js'
import marked from 'marked'

import fields from './fields.json'

export class Model extends base.Model {
	
	get resourceName() { return 'image' }

	get defaults() {

		return {
			name: 'image',
			encoded: '',
			credit: ''
		}

	}


	get fields() { return fields }


	getViewUrl() { return null }


	/*
	 * Gets encoded url to use as a CSS background-image. 
	 * 
	 */
	getUrl() {
		var encoded = this.get('encoded')
		encoded = encoded.replace(/(\r\n|\n|\r)/gm, '')
		if (encoded != null) {
			return `url('data:image/png;base64,${encoded}')`
		}
	}


	/* 
	 * Gets html attribute.
	 *
	 */
	getAttributionHtml() {
		return marked(this.get('credit'))
	}

}


export class Collection extends base.Collection {

	get model() { return Model }

}