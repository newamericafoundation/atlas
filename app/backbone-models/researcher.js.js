this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.Researcher = Models.BaseModel.extend();
  return Models.Researchers = Models.BaseCollection.extend({
    model: Models.Researcher
  });
});
