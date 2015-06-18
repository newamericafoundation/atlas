@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	Explainer.processGoogleChart = ($el, index) ->

		className = 'ct-chart-' + index
		selector = '.' + className

		$chartContainer = $('<div></div>')
		$($el.parent()).append $chartContainer
		$chartContainer.attr 'class', 'ct-chart ' + className

		src = $el.attr 'src'

		chart = new Atlas.Components.Chart.GoogleChartProcessor src

		chartData = chart.getChartData()
		chartType = chart.getChartType()

		options = 
			'Line': {}
			'Pie':
				labelDirection: 'explode'
				labelOffset: 30

		if chartType is 'Line' or chartType is 'Pie'
			new Chartist[chartType] selector, chartData, options[chartType]

		@

	toSentenceCase = (str) ->
		str.replace /\w\S*/g, (txt) -> 
			txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()

	getAtlasChartData = ($el) ->

		data = {}

		data.series = []
		data.labels = []

		type = $el.attr('data-type')
		type = toSentenceCase type
		data.type = type

		subtype = if $el.attr('data-options')? then $el.attr('data-options') else $el.attr('data-subtype')
		data.subtype = if subtype? then subtype.split ',' else []

		$el.find('.atlas-chart__series').each ->
			$this = $(@)
			name = $this.attr 'data-name'
			series = {}
			d = $this.html().split ','
			if type in [ "Line", "Bar" ]
				d = _.map d, (el) -> parseFloat(el)
				series.data = d
				series.name = name
				series = d if type is "Bar"
			else if type is "Pie"
				series = parseFloat d[0]
				data.labels.push name
			data.series.push series
		if type in [ "Line", "Bar" ]
			data.labels = $el.find('.atlas-chart__labels').html().split(',')

		data


	Explainer.processAtlasChart = ($el, index) ->
		width = $el.width()
		className = 'ct-chart-' + index
		selector = '.' + className
		data = getAtlasChartData $el
		$chartContainer = $('<div></div>')
		$el.append $chartContainer
		$chartContainer.attr 'class', 'ct-chart ' + className
		options =
			'Line':
				lineSmooth: Chartist.Interpolation.simple
					divisor: 2
			'Pie':
				labelDirection: 'explode'
				labelOffset: 30
			'Bar':
				stackBars: ('stacked' in data.subtype)
				horizontalBars: ('horizontal' in data.subtype)
				axisX:
					offset: 30
				axisY:
					offset: if ('long-horizontal-labels' in data.subtype) then (width/2 - 40) else 80

		if data.type in [ 'Line', 'Pie', 'Bar' ]
			chart = new Chartist[data.type] selector, { series: data.series, labels: data.labels }, options[data.type]
			chart.on 'created', -> 
				$seriesArray = $el.find('.ct-series')
				seriesArrayLength = $seriesArray.length
				$seriesArray.each (index, value) ->
					color = App.CSS.Colors.interpolateRgb(1 - (index / (seriesArrayLength - 1)))
					$series = $(@)
					$series.find('line, path').css('stroke', color)

