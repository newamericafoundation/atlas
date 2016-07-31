I created a custom Backbone Collection class that automatically handles the selected state of the models. I did a constructor override as follows:

	C = Backbone.Collection.extend({
		constructor: function() {
			Backbone.Collection.apply(this, arguments);
			this.on('reset', function() {
				this._doStuff();
			});
		}
	});

Later on in the application, I tapped into the collection instance's reset event again. Sure enough, the asynchronous this._doStuff method wasn't quite done yet and the bug that resulted stuck around for several weeks. I settled with the following fix:

	C = Backbone.Collection.extend({
		constructor: function() {
			var that = this;
			Backbone.Collection.apply(this, arguments);
			this.on('reset', function() {
				this._doStuff({
					onStuffDone: function() {
						that.trigger('do:stuff');
					}
				});
			});
		}
	});

In the application, I listened to this new do:stuff event instead, or in fancy terms, extended the Backbone Collection event cycle.

If the method wasn't async, things would have worked out, as the listener registered inside the constructor gets executed first. This will not hold true if the listener is registered with a "listenTo" method instead of an "on" method, and things will break if the method becomes async later down the line. Long story short - custom events are a good thing!
