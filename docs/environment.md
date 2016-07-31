# The Environment

Current environment variables are the following:

	NODE_ENV
	PORT
	GOOGLE_CLIENT_ID
	GOOGLE_CLIENT_SECRET
	PRERENDER_TOKEN
	PRODUCTION_DB_URL
	MAPBOX_API_KEY
	AWS_ACCESS_KEY_ID
	AWS_SECRET_ACCESS_KEY

These variables are set in the ``.env`` file in development, and on Beanstalk in production (``eb setenv var1=value1 var2=value2 var3=value3``).

Important: ``PORT`` must not be explicitly set in production mode (Beanstalk sets this automatically, both on the environment and on nginx). 

``NODE_ENV=development`` must be set in development mode.

## Google Creds

Google credentials are used to run authentication.

## AWS Creds

These variables are used to connect to the s3 bucket.