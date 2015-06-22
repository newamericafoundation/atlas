this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.Variable = Models.BaseModel.extend();
  return Models.Variables = Models.BaseCollection.extend({
    model: Models.Variable
  });
});
