@Atlas.module 'Assets', (Assets, App, Backbone, Marionette, $, _) ->

	# SVG assets store and SVG path manipulation logic.
	# Used to display custom SVG's on d3 visualizations.
	Assets.svg =

		shapes:

			pindrop_illustrator:
				dim:
					width: 612
					height: 792
				paths:
					outer: "M306,14.8c145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3C160.8,570.1,43.8,421.4,43.8,277C43.8,131.8,160.8,14.8,306,14.8z"
					inner: "M306,175.8c-60.7,0-111.8,51.1-111.8,112.7S244.4,401.1,306,401.1S417.8,350,417.8,288.4S367.6,175.8,306,175.8z"
					slice_1_of_2:   "M306,788.3C160.8,568.3,43.8,420.5,43.8,276.1C43.8,130.9,161.7,14.8,306,14.8v161c-60.7,0-111.8,50.2-111.8,111.8S244.4,401.1,306,401.1V788.3z"
					slice_2_of_2:   "M306,401.1c60.7,0,111.8-50.2,111.8-111.8S367.6,175.8,306,175.8v-161c145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3V401.1z"
					slice_1_of_3:   "M194.2,288.5c0-21.4,6.2-41.5,16.8-58.5V32.4C113,70.4,43.8,165.3,43.8,277c0,111,69.2,224.6,167.2,370.4V347.3C200.4,330.2,194.2,310.1,194.2,288.5z"
					slice_2_of_3_a: "M306,176.7c40,0,75.2,21.2,95,52.9v-197c-29.4-11.5-61.5-17.8-95-17.8s-65.6,6.3-95,17.6V230C230.9,198.1,266.4,176.7,306,176.7z"
					slice_2_of_3_b: "M306,400.2c-40,0-75.2-21.2-95-52.9v300.1c29.4,43.8,61.5,90.5,95,140.9c33.4-51,65.5-98.2,95-142.4V347.2C381.2,379,346,400.2,306,400.2z"
					slice_3_of_3:   "M401,32.6v197c10.6,17.1,16.8,37.2,16.8,58.8s-6.2,41.7-16.8,58.8v298.7C498.3,500.5,568.2,387.7,568.2,277C568.2,166,499,70.7,401,32.6z"

			pindrop_new:
				dim:
					width: 30
					height: 38.8235294117647
				paths:
					inner: "M15,8.618c-2.975,0-5.48,2.505-5.48,5.525S11.98,19.662,15,19.662S20.48,17.157,20.48,14.137S18.02,8.618,15,8.618z"
					outer: "M15,0.725c7.118,0,12.853,5.779,12.853,12.853S22.029,27.902,15,38.642C7.882,27.946,2.147,20.657,2.147,13.578C2.147,6.461,7.882,0.725,15,0.725z"
					slice_1_of_2: "M15,38.642C7.882,27.858,2.147,20.613,2.147,13.534C2.147,6.417,7.926,0.725,15,0.725v7.892c-2.975,0-5.48,2.461-5.48,5.48S11.98,19.662,15,19.662V38.642z"
					slice_1_of_3: "M9.52,14.142c0-1.049,0.304-2.034,0.824-2.868V1.588C5.539,3.451,2.147,8.103,2.147,13.578c0,5.441,3.392,11.01,8.196,18.157V17.025C9.824,16.186,9.52,15.201,9.52,14.142z"
					slice_2_of_2: "M15,19.662c2.975,0,5.48-2.461,5.48-5.48S18.02,8.618,15,8.618v-7.892c7.118,0,12.853,5.779,12.853,12.853S22.029,27.902,15,38.642V19.662z"
					slice_2_of_3_a: "M15,8.662c1.961,0,3.686,1.039,4.657,2.593v-9.657c-1.441-0.564-3.015-0.873-4.657-0.873s-3.216,0.309-4.657,0.863V11.275C11.319,9.711,13.059,8.662,15,8.662z"
					slice_2_of_3_b: "M15,19.618c-1.961,0-3.686-1.039-4.657-2.593v14.711c1.441,2.147,3.015,4.436,4.657,6.907c1.637-2.5,3.211-4.814,4.657-6.98V17.02C18.686,18.578,16.961,19.618,15,19.618z"
					slice_3_of_3: "M19.657,1.598v9.657c0.52,0.838,0.824,1.824,0.824,2.882s-0.304,2.044-0.824,2.882v14.642C24.426,24.534,27.853,19.005,27.853,13.578C27.853,8.137,24.461,3.466,19.657,1.598z"

			pindrop:
				dim:
					width: 30
					height: 38.8
				paths:
					outer: 'M14.951,0.725c7.118,0,12.853,5.779,12.853,12.853S21.98,27.902,14.951,38.642C7.833,27.946,2.098,20.657,2.098,13.578C2.098,6.461,7.833,0.725,14.951,0.725z'
					inner: 'M14.951,8.662c-2.975,0-5.48,2.461-5.48,5.48S11.931,19.618,14.951,19.618S20.431,17.157,20.431,14.137S17.971,8.662,14.951,8.662z'
					left:  'M14.951,38.686C7.833,27.902,2.098,20.657,2.098,13.578C2.098,6.461,7.877,0.77,14.951,0.77v7.892c-2.975,0-5.48,2.461-5.48,5.48S11.931,19.618,14.951,19.618V38.686z'
					right: 'M14.951,19.662c2.975,0,5.48-2.461,5.48-5.48S17.971,8.662,14.951,8.662V0.725c7.118,0,12.853,5.779,12.853,12.853S21.98,27.902,14.951,38.642V19.662z'

			hex:
				border: "M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"
				yes: "70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5"
				no: "72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2,57.8,50"
				down: "M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z"
				up: "M38.4,53c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l14.4-14.4l0,0l0.3-0.3c0.8-0.8,2-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3l0.3,0.3l0,0l14.4,14.4c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0l-7.2-7.2v19.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1V45.8L38.4,53z"
				left: "M53,61.6c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0L32.4,53.5l0,0L32,53.1c-0.8-0.8-1.3-2-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1l0.3-0.3l0,0l14.4-14.4c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2l-7.2,7.2h19.1c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3H45.8L53,61.6z"
				right: "M47,38.4c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l14.4,14.4l0,0l0.3,0.3c0.8,0.8,1.3,2,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1l-0.3,0.3l0,0L53.3,67.8c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l7.2-7.2H35.1c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3h19.1L47,38.4z"

		_matchers:
			absolutePath: /[MCSV]/g
			relativePath: /[csv\-\,]/g
			path: /[McCsSvVz]/g
			number: /[\-\,]/g
			all: /[McCsSvVz\-\,]/g

		# Extract numbers from svg path. Minus signs are recognized as delimiters and do not show up in the result of this method (use _moveMinusSigns).
		_getPathNumbers: (svgPath) ->
			svgPath.split @_matchers.all
		
		# Extract delimiters from svg path.
		_getPathDelimiters: (svgPath) ->
			delimiters = svgPath.match @_matchers.all

		# Moves minus signs from delimiters to numbers.
		_moveMinusSigns: (delimiters, numbers) ->
			for delim, i in delimiters
				if delim is "-"
					delimiters[i] = ""
					numbers[i+1] = "-" + numbers[i+1]

		# Formats numbers.
		_formatNumbers: (numbers) ->
			for number, i in numbers
				if not isNaN(number)
					numbers[i] = Math.round(parseFloat(number) * 1000) / 1000

		# Parses numbers
		_parseNumbers: (numbers) ->
			for number, i in numbers
				if not isNaN(number)
					numbers[i] = parseFloat(number)

		# Scales Numbers
		_scaleNumbers: (numbers, scale) ->
			for number, i in numbers
				if not isNaN(number)
					numbers[i] = number * scale

		# Translates numbers.
		_translateNumbers: (numbers, delimiters, dx, dy) ->
			for number, i in numbers
				if not isNaN(number)
					if @_getCoordinateType(numbers, i, delimiters) is "x"
						numbers[i] += dx
					else if @_getCoordinateType(numbers, i, delimiters) is "y"
						numbers[i] += dy


		# Rebuild svg path.
		_rebuild: (delimiters, numbers) ->
			res = ""
			for delim, i in delimiters
				res += delim
				if (numbers[i + 1]?) and (not isNaN(numbers[i + 1]))
					res += numbers[i + 1]
			res

		# Scales all numbers in svg path
		scalePath: (svgPath, transform) ->
			scale = if (transform? and transform.scale?) then transform.scale else 1
			dx = if (transform? and transform.translate? and transform.translate.x?) then transform.translate.x else 0
			dy = if (transform? and transform.translate? and transform.translate.y?) then transform.translate.y else 0
			delimiters = @_getPathDelimiters svgPath
			numbers = @_getPathNumbers svgPath
			@_moveMinusSigns delimiters, numbers
			@_parseNumbers(numbers)
			@_scaleNumbers(numbers, scale)
			@_formatNumbers(numbers)
			@_rebuild delimiters, numbers
			
		# Too complex to implement with current setup.
		# translatePath: (svgPath, dx, dy) ->

		# Scales entire svg shape.
		scaleShape: (shape, scale) ->
			shp =
				dim: {}
				paths: {}

			shp.dim.width = shape.dim.width * scale
			shp.dim.height = shape.dim.height * scale

			for key, value of shape.paths
				shp.paths[key] = @scalePath(value, { scale: scale })

			return shp


	#shape = Assets.svg.shapes.pindrop_illustrator
	#console.log Assets.svg.scaleShape(shape, 30/612)
