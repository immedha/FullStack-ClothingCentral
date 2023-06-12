# Products API Documentation
The Central API provides information about the products available in an ecommerce clothing store called ClothingCentral.

## List of all items
**Request Format:** /central/items with optional query parameter `category`

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** It returns all products that you can look up in this API. More specifically, it returns an array of objects where each object represents a product. If `category` is provided, it returns all the items that are within that category.

**Example Request:** /central/items

**Example Response (partial):**
```json
[
  {
    id: 1,
    item_name: "VIP's favorite 1",
    category: 'vip',
    subcategory: 'extra',
    price: 1000,
    stock: null
  },
  {
    id: 2,
    item_name: "VIP's favorite 2",
    category: 'vip',
    subcategory: 'extra',
    price: 1000,
    stock: null
  }
]
```
**Example Request with `category`:** /central/items?category=men

**Example Response (partial):**
```json
[
  {
    id: 4,
    item_name: "men's red shirt",
    category: 'men',
    subcategory: 'shirt',
    price: 26.54,
    stock: null
  },
  {
    id: 5,
    item_name: "men's orange shirt",
    category: 'men',
    subcategory: 'shirt',
    price: 99.08,
    stock: 20
  }
]
```

**Error Handling:**
Possible 500 code error if something goes wrong in the server (plain text): `Internal error. Try again.`

## Check if username and password are correct
**Request Format:** /central/login with parameters `user` and `pwd`

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** It logs in the user if the username and password are correct. Requires username and password to be stored/known to be able to check if correct.

**Example Request:** /central/login with username=myuser and password=mypwd

**Example Response:** `success`

**Error Handling:**
All errors are in plain text.
There are 400 code errors when:
* username or password parameters were not given: `Username or password not provided`
* if given username/password are incorrect: `Incorrect username or password`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`

## Retrieves transaction history
**Request Format:** /central/history

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns the transaction history for a user. More specifically, it returns an array containing objects storing items the user purchased. Requires the user to be logged in.

**Example Request:** /central/history

**Example Response:**
```json
[
  {
    item_name: "VIP's favorite 2",
    price: 1000,
    trans_time: '2023-06-05 21:26:05',
    confirm_num: 2
  }
]
```

**Error Handling:**
All errors are in plain text.
There is a 400 code error when user is not logged in: `Not logged in`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`

## Creates transaction to purchase item
**Request Format:** /central/purchase with parameter `item`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Returns whether or not a transaction was successful, and a confirmation code if it is. User must be logged in before completing transaction. A confirmation code is a unique string of numeric characters.

**Example Request:** /central/purchase with item=1

**Example Response:**
```json
{
  confirm: 3
}
```

**Error Handling:**
All errors are in plain text.
There are 400 code errors when:
* user is not logged in: `Not logged in`
* item id is invalid or not given: `Item id is not given or is invalid`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`

## Search items
**Request Format:** /central/search with parameter `term`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** The search term can either be the item id or name. Returns an object for a product that matches the search.

**Example Request:** /central/search with term=1

**Example Response:**
```json
{
  id: 1,
  item_name: "VIP's favorite 1",
  category: 'vip',
  subcategory: 'extra',
  price: 1000,
  stock: null
}
```

**Error Handling:**
All errors are in plain text.
There are 400 code errors when:
* the search term is invalid: `invalid search term`
* if search term was not given: `Search term is not given`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`

## Gets item ratings
**Request Format:** /central/get_ratings/:item where item is the item id.

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns an array of objects for all ratings for a given item. The data includes the numerical rating, written response, username of who submitted the review, and the date when the review was given.

**Example Request:** /central/get_ratings/:1

**Example Response (partial):**
```json
[
  {
    rating: 5,
    response: 'amazing!!!',
    username: 'user3',
    feedback_time: '2023-06-05 19:50:33'
  },
  {
    rating: 3,
    response: null,
    username: 'user3',
    feedback_time: '2023-06-05 21:27:20'
  }
]
```

**Error Handling:**
All errors are in plain text.
There is a 400 code error when the item id is invalid: `Item couldn't be found`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`

## Check cart
**Request Format:** /central/add_feedback with parameters `item`, `rating`, `response`

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Stores the review and sends a success message. Requires the user to be logged in.

**Example Request:** /central/add_feedback with item=1, rating=3, and response=test

**Example Response:**
```
success
```

**Error Handling:**
All errors are in plain text.
There are 400 code errors when:
* user is not logged in: `Not logged in`
* if rating is not given or is not valid: `Rating was not given or was invalid`
* item was not given or was invalid: `Item id was invalid or was not given.`
* there is no item with the given item id: `Item with that id doesn't exist.`

A 500 code error is when something goes wrong with the server: `Internal error. Try again.`