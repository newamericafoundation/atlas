this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  return Models.RichGeoJson = Backbone.Model.extend({
    initialize: function() {
      _.extend(this, Backbone.Events);
      this.type = 'FeatureCollection';
      return this.features = [];
    },
    onReady: function(next) {
      if (this.features.length > 0) {
        next();
        return;
      }
      return this.on('sync', next);
    }
  });
});
