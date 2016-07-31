import $ from 'jquery'
import ChartistHtml from 'chartist-html'

function configureJQuery($) {
	$.fn.ensureScript = function(globalName, path, next) {
		// The exposed global is already defined on window.
		if (window[globalName]) {
			return next()
		}
		// If the script is not yet loaded, load it now.
		$.ajax({
			url: path,
			contentType: 'text/javascript; charset=utf-8',
			dataType: 'script',
			success: next
		})
	}
}

function configureChartistHtml() {
	var { config } = ChartistHtml
	ChartistHtml.config.baseClass = "atlas-chart"
	ChartistHtml.config.colorSpectrum = [ '#85026A', '#019fde' ]
	ChartistHtml.config.tooltipTemplate = function(data) {
		var { label, value } = data
		return `<div><h1>${label}</h1><p>${value}</p></div>`
	}
	ChartistHtml.config.chartOptions.bar.options.base.seriesBarDistance = 28
	ChartistHtml.config.labelOffsetCoefficient = 5
}

configureJQuery($)
configureChartistHtml()
