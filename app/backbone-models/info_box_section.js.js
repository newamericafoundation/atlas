this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.InfoBoxSection = App.Models.BaseModel.extend();
  return Models.InfoBoxSections = App.Models.BaseCollection.extend();
});
