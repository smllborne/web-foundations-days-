# Library Books REST API

This REST API manages books in a library system.

## Base Resource

The main resource is:

`/books`

---

## 1. List All Books

**Method:** `GET`

**Path:** `/books`

**Description:** Returns a list of all books in the library.

**Request Body:** None

**Success Status:** `200 OK`

**Example Request:**

`GET /books`

---

## 2. Get One Book

**Method:** `GET`

**Path:** `/books/{id}`

**Description:** Returns one book using its unique ID.

**Request Body:** None

**Success Status:** `200 OK`

**Example Request:**

`GET /books/15`

---

## 3. Create a Book

**Method:** `POST`

**Path:** `/books`

**Description:** Creates a new book in the library.

**Example Request Body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publicationYear": 1958
}
```

**Success Status:** `201 Created`

---

## 4. Update a Book

**Method:** `PUT`

**Path:** `/books/{id}`

**Description:** Updates the information of an existing book.

**Example Request Body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publicationYear": 1958
}
```

**Success Status:** `200 OK`

**Example Request:**

`PUT /books/15`

---

## 5. Delete a Book

**Method:** `DELETE`

**Path:** `/books/{id}`

**Description:** Deletes a book from the library using its ID.

**Request Body:** None

**Success Status:** `204 No Content`

**Example Request:**

`DELETE /books/15`

---

## 6. List Books by Author

**Method:** `GET`

**Path:** `/books?author={authorName}`

**Description:** Returns books written by the specified author using a query parameter.

**Request Body:** None

**Success Status:** `200 OK`

**Example Request:**

`GET /books?author=Chinua%20Achebe`

---

# Error Codes

## 400 Bad Request

This error occurs when the client sends an invalid request.

**Example:**

A client tries to create a book without providing a required title.

`POST /books`

```json
{
  "author": "Chinua Achebe"
}
```

**Response Status:** `400 Bad Request`

---

## 404 Not Found

This error occurs when the requested book does not exist.

**Example:**

A client requests a book with an ID that does not exist.

`GET /books/9999`

**Response Status:** `404 Not Found`
