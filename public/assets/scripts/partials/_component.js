/** @jsx React.DOM */;
var Comp;

Comp = {};

Comp.About = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "about"
    }, React.createElement("h1", {
      "class": "title"
    }, "About Atlas"));
  }
});

Comp.Welcome = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "welcome"
    }, React.createElement("div", {
      "id": "welcome__terrain",
      "className": "-id-welcome__terrain"
    }), React.createElement("div", {
      "className": "welcome__title"
    }, React.createElement("h1", {
      "className": "welcome__title__name"
    }, "ATLAS"), React.createElement("h1", {
      "className": "welcome__title__alias c-2-0"
    }, "=ANALYSIS")), React.createElement("div", {
      "className": "welcome__strip bg-c-2-0"
    }), React.createElement("div", {
      "className": "welcome__subtitle"
    }, "\t\t\t\tA policy analysis tool from New America\'s Education Program"), React.createElement(Comp.Welcome.Nav, {
      "app": this.props.app
    }));
  }
});

Comp.Welcome.Nav = React.createClass({
  navigate: function(e) {
    var app;
    app = this.props.app;
    if (app != null) {
      e.preventDefault();
      app = this.props.app;
      return app.router.navigateApp('menu');
    }
  },
  render: function() {
    return React.createElement("div", {
      "className": "welcome__main-nav"
    }, React.createElement("a", {
      "href": "/menu",
      "onClick": this.navigate,
      "className": "bg-img-grid--off-white",
      "id": "welcome__main-nav__button"
    }), React.createElement("p", {
      "className": "center"
    }, "View All Projects"));
  }
});

Comp.Projects = React.createClass({
  render: function() {
    return React.createElement("div", null);
  }
});

Comp.Projects.Show = React.createClass({
  render: function() {
    return React.createElement("div", null);
  }
});

Comp.Projects.Show.Explainer = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "fill-parent"
    }, React.createElement("div", {
      "className": "atl__title-bar atl__title-bar--solid bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl__title-bar__background"
    }), React.createElement("div", {
      "className": "atl__title-bar__content"
    }, React.createElement("h1", {
      "className": 'title'
    }, this.props.model.get('title')), React.createElement("ul", null, React.createElement("li", null, "Updated: ", moment(this.props.model.get('updated_at')).format("MMMM Do YYYY"))))), React.createElement("div", {
      "className": "atl__content-bar bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl-grid"
    }, React.createElement("div", {
      "className": "atl-grid__1-3"
    }, React.createElement("div", {
      "className": "atl__page-nav"
    }, React.createElement("div", {
      "className": "atl__toc"
    }, React.createElement("p", null, "Page Contents"), React.createElement("div", {
      "id": "atl__toc__list"
    }, React.createElement("div", {
      "className": "loading-icon"
    }, React.createElement("div", null)))))), React.createElement("div", {
      "className": "atl-grid__2-3"
    }, React.createElement("div", {
      "className": "static-content",
      "dangerouslySetInnerHTML": {
        __html: this.props.model.get('body_text')
      }
    }), React.createElement("div", {
      "id": "atl__related"
    }, React.createElement(Comp.Projects.Show.Explainer.RelatedPages, {
      "collection": this.props.collection
    }))), React.createElement("div", {
      "className": "atl-grid__3-3"
    }))));
  }
});

Comp.Projects.Show.Explainer.RelatedPages = React.createClass({
  getPages: function() {
    console.log(this.props.collection);
    return this.props.collection.map(function() {
      return React.createElement("li", null);
    });
  },
  render: function() {
    return React.createElement("div", null, React.createElement("p", null, "Related Pages"), React.createElement("ul", null, this.getPages()));
  }
});
