this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.ProjectTemplate = Models.BaseFilterModel.extend({
    urlRoot: '/api/v1/project_templates'
  });
  return Models.ProjectTemplates = Models.BaseFilterCollection.extend({
    model: Models.ProjectTemplate,
    url: '/api/v1/project_templates',
    hasSingleActiveChild: true,
    initializeActiveStatesOnReset: true,
    comparator: 'order',
    initialize: function() {
      return this.on('initialize:active:states', function() {
        return App.vent.trigger('project:filter:change', this);
      });
    }
  });
});
