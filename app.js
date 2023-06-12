/*
 * Medha Gupta
 * June 5, 2023
 * CSE 154 AB: Allan Tran, Elizabeth Xiong
 *
 * This is the app.js page that stores data for the ClothingCentral website. It stores all the
 * products the website sells, feedback, transactions, and checks login information.
 */
"use strict";

const express = require("express");
const multer = require("multer");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

const INTERNAL_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEFAULT_PORT = 8000;
const INTERNAL_ERR_TEXT = "Internal error. Try again.";
const LOGIN_ERROR = "Not logged in.";

/*
 * Gets all the products or products from a specific category.
 */
app.get("/central/items", async (req, res) => {
  try {
    let category = req.query.category;
    let db = await getDBConnection();
    let results;
    if (category) {
      let query = "SELECT * FROM items WHERE category = ? ORDER BY id";
      results = await db.all(query, category);
    } else {
      let query = "SELECT * FROM items ORDER BY id";
      results = await db.all(query);
    }
    await db.close();
    res.json(results);
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).type("text");
    res.send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Gets the transaction history for a given user if they are logged in.
 */
app.get("/central/history", async (req, res) => {
  try {
    if (req.cookies.user) {
      let db = await getDBConnection();
      let query = "SELECT i.item_name, i.price, t.trans_time, t.confirm_num";
      query += " FROM transactions t, items i WHERE t.username = ? AND t.item_id = i.id";
      let results = await db.all(query, req.cookies.user);
      await db.close();
      res.json(results);
    } else {
      res.type("text").status(CLIENT_ERR_CODE);
      res.send(LOGIN_ERROR);
    }
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).type("text");
    res.send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Checks whether a user is logged in and has the correct username and password.
 */
app.post("/central/login", async (req, res) => {
  res.type("text");
  try {
    let username = req.body.user;
    let password = req.body.pwd;
    if (username && password) {
      if (req.cookies.user) {
        res.send("Already signed in!");
      } else {
        let db = await getDBConnection();
        let query = "SELECT * FROM login WHERE username=? AND pwd=?";
        let results = await db.get(query, [username, password]);
        await db.close();
        if (results) {
          res.cookie("user", username, {expires: new Date("Tue, January 19, 2038 03:14:07 GMT")});
          res.send("success");
        } else {
          res.status(CLIENT_ERR_CODE).send("Incorrect username or password");
        }
      }
    } else {
      res.status(CLIENT_ERR_CODE).send("Username or password not provided");
    }
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Creates a transaction for purchasing a product if the user making the transaction is logged in,
 * and sends a confirmation number.
 */
app.post("/central/purchase", async (req, res) => {
  try {
    let itemId = req.body.item;
    if (itemId && /^[0-9]+$/.test(itemId)) {
      let response = await purchaseItem(req.cookies.user, parseInt(itemId));
      if (response.length === 2) {
        res.type("text").status(CLIENT_ERR_CODE);
        res.send(response[1]);
      } else {
        res.json(response[0]);
      }
    } else {
      res.type("text").status(CLIENT_ERR_CODE);
      res.send("Item id is not given or is invalid");
    }
  } catch (err) {
    res.type("text").status(INTERNAL_ERR_CODE);
    res.send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Searches the products either by item id or item name.
 */
app.post("/central/search", async (req, res) => {
  try {
    let search = req.body.term;
    if (search) {
      let response = await getSearch(search);
      if (response.length === 2) {
        res.status(CLIENT_ERR_CODE).type("text");
        res.send(response[1]);
      } else {
        res.json(response[0]);
      }
    } else {
      res.status(CLIENT_ERR_CODE).type("text");
      res.send("Search term is not given");
    }
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).type("text");
    res.send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Gets the ratings for a given item.
 */
app.get("/central/get_ratings/:item", async (req, res) => {
  try {
    let itemId = req.params.item;
    if (/^[0-9]+$/.test(itemId)) {
      let query = "SELECT rating, response, username, feedback_time";
      query += " FROM feedback WHERE item_id = ?";
      let db = await getDBConnection();
      let results = await db.all(query, parseInt(itemId));
      await db.close();
      res.json(results);
    } else {
      res.status(CLIENT_ERR_CODE).type("text");
      res.send("Item couldn't be found");
    }
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).type("text");
    res.send(INTERNAL_ERR_TEXT);
  }
});

/*
 * Stores new feedback about an item if the user is logged in.
 */
app.post("/central/add_feedback", async (req, res) => {
  res.type("text");
  try {
    let username = req.cookies.user;
    let itemId = req.body.item;
    if (username) {
      if (itemId && /^[0-9]+$/.test(itemId)) {
        let db = await getDBConnection();
        let query = "SELECT item_name FROM items WHERE id = ?";
        let result = await db.get(query, itemId);
        await db.close();
        if (result) {
          let toSend = await addFeedback(username, itemId, req.body.rating, req.body.response);
          if (toSend !== "success") {
            res.status(CLIENT_ERR_CODE);
          }
          res.send(toSend);
        } else {
          res.status(CLIENT_ERR_CODE).send("Item with that id doesn't exist.");
        }
      } else {
        res.status(CLIENT_ERR_CODE).send("Item id was invalid or was not given.");
      }
    } else {
      res.status(CLIENT_ERR_CODE).send(LOGIN_ERROR);
    }
  } catch (err) {
    res.status(INTERNAL_ERR_CODE).send(INTERNAL_ERR_TEXT);
  }
});

/**
 * Stores given feedback about an item.
 * @param {String} username - username associated with that review
 * @param {String} itemId - id of item
 * @param {String} rating - rating given for that item
 * @param {String} response - text response associated with the rating
 * @returns {String} a response to send back after feedback is added
 */
async function addFeedback(username, itemId, rating, response) {
  let toSend;
  if (rating && /^[12345]$/.test(rating)) {
    let db = await getDBConnection();
    if (response && response.length !== "") {
      let addFeedbackQuery = "INSERT INTO Feedback (username, rating, item_id, response)";
      addFeedbackQuery += " VALUES(?, ?, ?, ?)";
      let parameters = [username, parseInt(rating), parseInt(itemId), response];
      await db.run(addFeedbackQuery, parameters);
    } else {
      let addFeedbackQuery = "INSERT INTO Feedback (username, rating, item_id)";
      addFeedbackQuery += " VALUES(?, ?, ?)";
      await db.run(addFeedbackQuery, [username, parseInt(rating), parseInt(itemId)]);
    }
    await db.close();
    toSend = "success";
  } else {
    toSend = "Rating was not given or was invalid";
  }
  return toSend;
}

/**
 * Searches for a specific item, either by id or name.
 * @param {String} search - search term
 * @returns {Array} item data if item for that search term is found, otherwise error
 */
async function getSearch(search) {
  let response = [];
  let result;
  let query;
  let db = await getDBConnection();
  if (/^[0-9]+$/.test(search)) {
    query = "SELECT * FROM items WHERE id = ?";
    search = parseInt(search);
  } else {
    query = "SELECT * FROM items WHERE item_name = ?";
  }
  result = await db.get(query, search);
  await db.close();
  if (result) {
    response.push(result);
  } else {
    response.push("error");
    response.push("invalid search term");
  }
  return response;
}

/**
 * Updates stock of item after it is purchased
 * @param {Object} itemDetails - information about item
 * @param {Database} db - database storing information
 * @param {String} username - username
 * @param {Integer} id - item id
 * @returns {Object} confirmation number and new stock of product
 */
async function updateStock(itemDetails, db, username, id) {
  let transacQuery = "INSERT INTO transactions (username, item_id) VALUES(?, ?)";
  let metadata = await db.run(transacQuery, [username, id]);
  let confirmNum = metadata.lastID;
  let response = {"confirm": confirmNum};
  if (itemDetails.stock) {
    let updateStockQuery = "UPDATE items SET stock = stock - 1 WHERE id = ?";
    await db.run(updateStockQuery, id);
    response.stock = itemDetails.stock - 1;
  }
  return response;
}

/**
 * Creates a transaction and purchases an item.
 * @param {String} username - username of user purchasing item
 * @param {Integer} itemId - id of the item being purchased
 * @returns {Array} - confirmation number if item could be purchased, otherwise error
 */
async function purchaseItem(username, itemId) {
  let toSend = [];
  if (username) {
    let db = await getDBConnection();
    let stockQuery = "SELECT stock FROM items WHERE id=?";
    let itemDetails = await db.get(stockQuery, itemId);
    if (itemDetails) {
      if (itemDetails.stock === null || itemDetails.stock > 0) {
        let response = await updateStock(itemDetails, db, username, itemId);
        toSend.push(response);
      } else {
        toSend.push("error");
        toSend.push("Not available");
      }
    } else {
      toSend.push("error");
      toSend.push("Item id doesn't exist");
    }
    await db.close();
  } else {
    toSend.push("error");
    toSend.push(LOGIN_ERROR);
  }
  return toSend;
}

/**
 * Creates a connection to the database storing website data.
 * @returns {Database} database storing the website data
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "clothing.db",
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);