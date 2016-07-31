## Testing Environment

Client- and server-side specs are run using the globally installed ``mocha`` with the following commands:

	``npm install mocha -g``
	``npm run spec``

Tests should be included inside the folder of tested modules inside a ``__spec`` subdirectory. This helps keep code and specs in place, allow things to be moved around, and saves one from the ``./../../../../app/assets/and/another/couple/of/additional/subfolders`` deal. No specs in a separate ``spec`` folder in root.

To ensure that new language features are supported by mocha, ``import 'babel-polyfill'`` must be included at the top of every spec file.