import gulp from 'gulp';
import download from 'gulp-download';
import unzip from 'gulp-unzip';
import shell from 'gulp-shell';

var shapeFileData = [
	{
		'name': 'school districts',
		'fileName': 'cb_2014_us_cd114_500k',
		'outputFileName': 'school_districts',
		'url': 'http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_cd114_500k.zip',
		'properties': {
			'state_id': 'STATEFP',
			'id': 'CD114FP'
		}
	},
	{
		'name': 'states',
		'fileName': 'cb_2014_us_state_500k',
		'outputFileName': 'states',
		'url': 'http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_state_500k.zip',
		'properties': {
			'id': 'STATEFP'
		}
	}
];

var shp = shapeFileData[1];

var renameParam = Object.keys(shp.properties).map((key) => {
	var value = shp.properties[key];
	return `${key}=${value}`;
}).join(',');

gulp.task('download-geo', () => {
	return download(shp.url)
		.pipe(unzip())
		.pipe(gulp.dest('./temp/shp'));
});

gulp.task('extract-geo', shell.task([
	`topojson -o temp/geojson/${shp.outputFileName}.json -p ${renameParam} -q 10000 -s 1e-8 temp/shp/${shp.fileName}.shp`
]));