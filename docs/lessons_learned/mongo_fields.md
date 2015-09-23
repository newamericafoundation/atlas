A MongoDB query in Node typically works like this:

	db.collection('somes').find(query, fields);

The fields variable in my case was conditionally set based on the query parameters, and ended up being undefined in some cases. To my surprise, the API didn't return anything, and froze the browser.

Turns out, if the fields is undefined, it must not be passed into the method..