var cheerio = require('cheerio'),
	fs = require('fs'),
	tidy = require('htmltidy').tidy,
	$; // Not jQuery, but a jQuery-like object created dynamically inside the code.

class IconSvgFile {

	/*
	 *
	 *
	 */
	constructor(options) {
		this.name = options.name;
		this.path = options.path;
	}


	/*
	 * Uppercase and join name.
	 * e.g. this.name = aaa-bbb-ccc returns AaaBbbCcc.
	 */
	getReactComponentName() {
		var nameParts = this.name.split('-');
		nameParts = nameParts.map((part) => {
			return part.slice(0, 1).toUpperCase() + part.slice(1);
		});
		return nameParts.join('');
	}


	/*
	 * Define React component from name and markup.
	 *
	 */
	defineReactComponent(componentName, renderMarkup) {
		/* multi-line formatted code */
return `
	Icons.${componentName} = () => {
		return (
	${renderMarkup}
		);
	}
`;
		/* end of multi-line formatted code */
	}


	/*
	 *
	 *
	 */
	processSvgDoc(doc) {
		$ = cheerio.load(doc, {
			normalizeWhitespace: false
		});
		$('*').attr('fill', null);
		$('*').attr('id', null);
		var html = $('svg').html();
		var $svg = $('<svg viewBox="0 0 100 100"></svg>').append(html);
		var $el = $('<div></div>').append($svg);
		var html = $el.html();
		html = html.replace(/viewbox/g, 'viewBox');
		return html;
	}


	/*
	 * Asynchronously gets React component definition.
	 * @param {function} next - Callback.
	 */
	getReactComponentDefinitionPromise() {
		return new Promise((resolve, reject) => {
			this.getSvgAsync((err, svg) => {
				if (err) { reject(err); }
				var compDef = this.defineReactComponent(this.getReactComponentName(), svg);
				this.reactComponentDefinition = compDef;
				return resolve(compDef);
			});
		});
		
	}


	/*
	 *
	 *
	 */
	getSvgAsync(next) {
		console.log(this.path);
		console.log(__dirname);
		fs.readFile(__dirname + this.path, 'utf-8', (err, doc) => {
			if (err) { return next(err); }
			return next(null, this.processSvgDoc(doc));
		});
	}

}


class IconSvgFiles {

	/*
	 *
	 *
	 */
	constructor(path) {
		this.path = path;
	}


	/*
	 *
	 *
	 */
	getIconName(fileName) {
		return fileName.slice(6, -4);
	}


	/*
	 *
	 *
	 */
	setIcons(next) {
		this.list = [];
		fs.readdir(__dirname + this.path, (err, files) => {
			if (err) { return next(err); }
			this.list = files.map((file) => {
				return new IconSvgFile({ 
					name: file.slice(6, -4),
					path: this.path + '/' + file
				});
			});
			return next(this);
		});
		return this;
	}


	/*
	 *
	 *
	 */
	getReactComponent(next) {

		var output = '';
		var resolvedCount = 0;

		this.list.forEach((iconSvgFile) => {

			iconSvgFile.getReactComponentDefinitionPromise().then((doc) => { 
				output += doc;
				resolvedCount += 1;
				console.log(resolvedCount + ' -- ' + this.list.length);
				if (resolvedCount === this.list.length) {
					next(output);
				}
			}, () => { resolvedCount += 1; console.log('fail'); });

		});

	}

}

// Entry point.
new IconSvgFiles('/../icons/svg')
	.setIcons((iconSvgFiles) => {
		if (iconSvgFiles == null) { return; }
		iconSvgFiles.getReactComponent((comp) => {
			fs.writeFile('output.jsx', comp, (err) => { if(err) { return console.dir(err); } return console.log('success'); });
		});
	});