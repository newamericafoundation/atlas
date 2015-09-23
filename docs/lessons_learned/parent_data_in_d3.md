D3 is data driven, and nested data is no exception. I ran into the following situation:

	svg.selectAll('g')
		.attr(function(groupData, groupIndex) {
			// ...
		})
		.selectAll('path')
		.attr(function(itemData, itemIndex) {
			// ... hey, where did groupData go?
		});

Data coupled to the parent node is readily accessible in the child node as follows:

	svg.selectAll('g')
		.attr(function(groupData, groupIndex) {
			// ...
		})
		.selectAll('path')
		.attr(function(itemData, itemIndex) {
			var groupData = d3.select(this.parentNode).datum()
			// that's better!
		});