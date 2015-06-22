this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.Filter = Models.BaseModel.extend({
    getVariableModel: function(variables) {
      return variables.findWhere({
        id: this.get('variable_id')
      });
    }
  });
  return Models.Filters = Models.BaseCollection.extend({
    model: Models.Filter
  });
});
