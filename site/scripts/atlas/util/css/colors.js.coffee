@Atlas.module 'CSS', (CSS, App, Backbone, Marionette, $, _) ->

	CSS.Colors =

		_list: [
			[133, 2, 106] 
			[138, 1, 135]
			[140, 2, 165] 
			[129, 10, 166]
			[118, 18, 167] 
			[106, 23, 167]
			[93, 43, 171]
			[79, 56, 173]
			[77, 72, 177]
			[73, 87, 182] 
			[67, 102, 186] 
			[58, 116, 191] 
			[44, 130, 195] 
			[11, 144, 199]
			[50, 161, 217]
		]

		_hash: {}

		get: (index) ->
			return @_list[index] if _.isNumber index
			return @_hash[index] # assume it is a string

		interpolate: (f) ->
			first = @_list[0]
			last = @_list[@_list.length - 1]
			interpolated = []
			interpolated.push Math.round(first[0] * f + last[0] * (1 - f))
			interpolated.push Math.round(first[1] * f + last[1] * (1 - f))
			interpolated.push Math.round(first[2] * f + last[2] * (1 - f))
			"rgba(#{interpolated.join(',')},#{1})"

		interpolateRgb: (f) ->
			first = @_list[0]
			last = @_list[@_list.length - 1]
			interpolated = []
			interpolated.push Math.round(first[0] * f + last[0] * (1 - f))
			interpolated.push Math.round(first[1] * f + last[1] * (1 - f))
			interpolated.push Math.round(first[2] * f + last[2] * (1 - f))
			"rgb(#{interpolated.join(',')})"

		toRgba: (index, opacity = 1) ->
			"rgba(#{@get(index).join(',')},#{opacity})"

		toRgb: (index) ->
			"rgb(#{@get(index).join(',')})"


	CSS.ClassBuilder = 

		# For a color scheme [1..n] and a value scheme [1..k], returns interpolated+interpolated i_n based on i_k.
		interpolate: (i_k, k, n = CSS.Colors._list.length) ->
			i_n = Math.round(1 + (n - 1) * (i_k - 1) / (k - 1))
