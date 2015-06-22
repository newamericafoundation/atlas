this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.ProjectSection = Models.BaseFilterModel.extend({
    urlRoot: '/api/v1/project_sections',
    parse: function(resp) {
      resp.id = String(resp.id);
      return resp;
    }
  });
  return Models.ProjectSections = Models.BaseFilterCollection.extend({
    model: Models.ProjectSection,
    url: '/api/v1/project_sections',
    hasSingleActiveChild: false,
    initializeActiveStatesOnReset: true,
    initialize: function() {
      return this.on('initialize:active:states', function() {
        return App.vent.trigger('project:filter:change', this);
      });
    }
  });
});
