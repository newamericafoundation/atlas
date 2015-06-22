this.Atlas.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.Image = Models.BaseModel.extend({
    urlRoot: '/api/v1/images',
    url: function() {
      return this.urlRoot + ("?name=" + (this.get('name')));
    },
    parse: function(resp) {
      resp = this._removeArrayWrapper(resp);
      resp = this._removeLineBreaks(resp, 'encoded');
      return resp;
    },
    getBackgroundImageCss: function() {
      var encoded;
      encoded = this.get('encoded');
      if (encoded != null) {
        return "url('data:image/png;base64," + encoded + "')";
      }
    },
    getAttributionHtml: function() {
      return this.getMarkdownHtml('credit');
    }
  });
  return Models.Images = Models.BaseCollection.extend({
    model: Models.Image,
    url: '/api/v1/images'
  });
});
