CREATE TABLE items(
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "item_name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "subcategory" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "stock" INTEGER
);

CREATE TABLE login(
  "username" TEXT NOT NULL PRIMARY KEY,
  "pwd" TEXT NOT NULL
);

CREATE TABLE transactions(
  "confirm_num" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT,
  "item_id" INTEGER,
  "trans_time" DATETIME DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY("username") REFERENCES login("username"),
  FOREIGN KEY("item_id") REFERENCES items("id")
);

CREATE TABLE feedback(
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT,
  "rating" INTEGER NOT NULL,
  "item_id" INTEGER,
  "response" TEXT,
  "feedback_time" DATETIME DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY("username") REFERENCES login("username"),
  FOREIGN KEY("item_id") REFERENCES items("id")
);

INSERT INTO items(item_name, category, subcategory, price)
  VALUES ("VIP's favorite 1", "vip", "extra", 1000.00);
INSERT INTO items(item_name, category, subcategory, price)
  VALUES ("VIP's favorite 2", "vip", "extra", 1000.00);
INSERT INTO items(item_name, category, subcategory, price)
  VALUES ("VIP's favorite 3", "vip", "extra", 1000.00);
INSERT INTO items(item_name, category, subcategory, price)
  VALUES ("men's red shirt", "men", "shirt", 26.54);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's orange shirt", "men", "shirt", 99.08, 20);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's yellow shirt", "men", "shirt", 83.19, 16);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's green shirt", "men", "shirt", 50.44, 34);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's blue shirt", "men", "shirt", 33.86, 9);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's purple shirt", "men", "shirt", 70.40, 7);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's black shirt", "men", "shirt", 40.45, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's brown shirt", "men", "shirt", 74.24, 17);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's gray shirt", "men", "shirt", 24.64, 16);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's white shirt", "men", "shirt", 75.14, 36);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's red pant", "men", "pant", 15.99, 64);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's orange pant", "men", "pant", 24.25, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's yellow pant", "men", "pant", 59.78, 3);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's green pant", "men", "pant", 10.29, 7);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's blue pant", "men", "pant", 73.44, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's purple pant", "men", "pant", 26.18, 14);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's black pant", "men", "pant", 87.97, 27);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's brown pant", "men", "pant", 29.15, 31);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's gray pant", "men", "pant", 54.50, 22);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's white pant", "men", "pant", 20.51, 15);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's red shorts", "men", "shorts", 22.28, 19);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's orange shorts", "men", "shorts", 45.93, 11);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's yellow shorts", "men", "shorts", 66.46, 1);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's green shorts", "men", "shorts", 92.36, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's blue shorts", "men", "shorts", 29.85, 4);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's purple shorts", "men", "shorts", 73.71, 9);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's black shorts", "men", "shorts", 34.38, 17);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's brown shorts", "men", "shorts", 45.60, 18);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's gray shorts", "men", "shorts", 46.59, 21);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("men's white shorts", "men", "shorts", 77.14, 23);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's red shirt", "women", "shirt", 38.74, 4);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's orange shirt", "women", "shirt", 22.22, 16);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's yellow shirt", "women", "shirt", 40.57, 18);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's green shirt", "women", "shirt", 18.46, 15);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's blue shirt", "women", "shirt", 52.43, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's purple shirt", "women", "shirt", 40.34, 14);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's black shirt", "women", "shirt", 33.44, 9);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's brown shirt", "women", "shirt", 45.36, 8);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's gray shirt", "women", "shirt", 69.86, 8);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's white shirt", "women", "shirt", 88.33, 7);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's red pant", "women", "pant", 87.06, 6);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's orange pant", "women", "pant", 41.94, 6);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's yellow pant", "women", "pant", 21.52, 5);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's green pant", "women", "pant", 37.91, 5);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's blue pant", "women", "pant", 92.39, 1);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's purple pant", "women", "pant", 42.77, 19);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's black pant", "women", "pant", 23.27, 17);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's brown pant", "women", "pant", 42.78, 18);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's gray pant", "women", "pant", 82.64, 23);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's white pant", "women", "pant", 13.42, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's red shorts", "women", "shorts", 52.52, 15);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's orange shorts", "women", "shorts", 84.26, 6);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's yellow shorts", "women", "shorts", 17.92, 7);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's green shorts", "women", "shorts", 58.29, 4);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's blue shorts", "women", "shorts", 78.41, 2);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's purple shorts", "women", "shorts", 99.93, 23);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's black shorts", "women", "shorts", 16.63, 11);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's brown shorts", "women", "shorts", 35.66, 19);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's gray shorts", "women", "shorts", 85.30, 27);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's white shorts", "women", "shorts", 40.94, 15);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's red dress", "women", "dress", 12.29, 23);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's orange dress", "women", "dress", 31.87, 6);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's yellow dress", "women", "dress", 50.04, 6);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's green dress", "women", "dress", 72.69, 5);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's blue dress", "women", "dress", 75.61, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's purple dress", "women", "dress", 70.56, 19);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's black dress", "women", "dress", 34.67, 14);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's brown dress", "women", "dress", 49.91, 12);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's gray dress", "women", "dress", 59.47, 19);
INSERT INTO items(item_name, category, subcategory, price, stock)
  VALUES ("women's white dress", "women", "dress", 39.64, 18);
INSERT INTO login(username, pwd)
  VALUES ("user1", "pwd1");
INSERT INTO login(username, pwd)
  VALUES ("user2", "pwd2");
INSERT INTO login(username, pwd)
  VALUES ("user3", "pwd3");