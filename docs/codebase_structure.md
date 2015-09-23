Main entry point: ``./app.js``.

Main folder structure:
* ``./app`` - models, views, components, routes, middleware and assets in development.
* ``./config`` - general app configuration.
* ``./db`` - database-related code and content. Includes seeds, the database connector and batch database update utilities.
* ``./public`` - public data, including precompiled assets and images.
* ``./spec`` - specs.
* ``./gulp_tasks`` - build tasks referenced from ``./gulpfile.js``.

Additional files:
* ``bower.json`` - client-side dependencies.
* ``package.json`` - package definition and server-side dependencies.

To allow code-sharing between server and client, models and components are written on the server and bundled to the client.