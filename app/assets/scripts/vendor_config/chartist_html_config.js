if (ChartistHtml) {

	ChartistHtml.config.baseClass = "atlas-chart" ;
	ChartistHtml.config.colorSpectrum = [ '#85026A', '#019fde' ];

	ChartistHtml.config.tooltipTemplate = function(data) {
		return "<div><h1>" + data.label + "</h1><p>" + data.value + "</p></div>";
	};

	ChartistHtml.config.chartOptions.bar.options.base.seriesBarDistance = 28;
	ChartistHtml.config.labelOffsetCoefficient = 5;

}