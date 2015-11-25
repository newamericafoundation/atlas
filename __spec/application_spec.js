import 'babel-polyfill'

import assert from 'assert'

import fs from 'fs'

describe('application', () => {

	it('has node_modules folder for bundle and server dependencies', (done) => {
		fs.readdir('./node_modules', (err, files) => {
			if(err) { throw err }
			done()
		})
	})

	it('has bower_components folder for client-side dependencies', (done) => {
		fs.readdir('./bower_components', (err, files) => {
			if(err) { throw err }
			done()
		})
	})

	it('has .elasticbeanstalk folder for production environment configurations', (done) => {
		fs.readdir('./.elasticbeanstalk', (err, files) => {
			if(err) { throw err }
			done()
		})
	})

	it('has .ebextensions folder for production environment extension settings', (done) => {
		fs.readdir('./.ebextensions', (err, files) => {
			if(err) { throw err }
			done()
		})
	})

	it('has .babelrc file to set the presets for Babel, the ES Next compiler', (done) => {
		fs.readFile('./.babelrc', (err, files) => {
			if(err) { throw err }
			done()
		})
	})

})