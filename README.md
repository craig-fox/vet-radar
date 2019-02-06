# vet-radar

This app runs on localhost:8080, and is activated via **npm start**

It connects to a remote MongoDb database on mLab. The credentials to access it are in **config/db.js**

If using a tool like Postman to send POST requests, the key/value pairs need to be sent via **x-www-form-urlencoded** format, rather than raw format. This equates to the header value **Content-Type: application/x-www-form-urlencoded**.
This had to be done to get persistence via Mongoose working.

To get a list of catalog products, send a GET request to

http://localhost:8080/catalog/list

A single catalog product can be accessed by name via a GET request to http://localhost:8080/catalog/{name}

###### Cart

To view all the items in the cart, send a GET request to http://localhost:8080/cart/items

(_The cart collection will be empty when the code is submitted_)

To view one item in the cart, send a GET request to http://localhost:8080/cart/items/{name}

To add an item to the cart, send a POST request to http://localhost:8080/cart/add, along with a request body holding values for 'name' and 'quantity'.

(The add URL is the same for all items, with the request body holding the pertinent information. Therefore, I didn't feel it necessary to store the URL with the catalog products)

To remove an item, send a POST request to http://localhost:8080/cart/remove with a request body holding a value for 'name'
