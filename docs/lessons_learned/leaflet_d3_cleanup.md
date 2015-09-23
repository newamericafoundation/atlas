Cleaning up visualizations prevent memory leaks, improving performance and preventing the most obscure bugs from popping up (these tend to be on the harder side to find). Turns out, for leaflet and d3, things are not that complicated.

	map = L.map(/* */);
	map.clearAllEventListeners();

	d3.selectAll(‘path’).remove();

Using listenTo and stopListening goes a long way when listening to other objects' events. Most of the time,

	this.stopListening();

tends to be simpler than

	foreignObject.off('all events that have been registered on this');