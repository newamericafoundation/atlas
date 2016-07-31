# Codebase Structure

The main entry point to the app is ``./app.js``.

Main folder structure:
* ``./app`` - models, views, components, routes, middleware and assets in development.
* ``./config`` - general app configuration.
* ``./db`` - database-related code and content. Includes seeds, the database connector and batch database update utilities.
* ``./public`` - public data, including precompiled assets and images.
* ``./gulp_tasks`` - build tasks referenced from ``./gulpfile.js``.

Additional files:
* ``bower.json`` - client-side dependencies.
* ``package.json`` - package definition and server-side dependencies.

## app

To allow code-sharing between server and client, models and components are written on the server and bundled to the client.

### assets

Contains styles, images and client-side JavaScript in development. The client-side JS uses modules outside of this directory that are available on the server (models, components, routes).

### components

Stores React components.

### middleware

Middleware for serving Gzip, making database operations etc.

### models

Model layer in Backbone.

### reducers

Redux reducers.

### routes

Client- and server-side routes.

### utilities

Miscellaneous utilities such as colors and formatters.

### views

Views used by Express to render the main HTML of the site.

## db

All things database: seeds, connector scripts etc.

## public

Stores public assets, such as fonts and images.