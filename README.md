# Clothing Central

Clothing Central is a full stack web project. It is an e-commerce clothing store. 

| File          | Description |
|---------------|------------------------------|
|`public/index.html`|This holds the entire front end of the website.|
|`public/img`|This folder holds all the product images|
|`public/styles.css`|This file contains the CSS styles for the front end.|
|`public/index.js`|This file contains the client-side JavaScript, which will call the Products API built in `app.js`|
|`app.js`|This file contains the Node.js service that is the back end API.|
|`clothing.db`|This file contains the database storing data for the website. |
|`package.json`|This file contains project dependencies |
|`APIDOC.md`|This file documents the `app.js` web service.|
|`tables.sql`|This file includes any CREATE statements used to first import data into the database.|
|`node_modules`|This folder holds all the dependency files|

Here are some features of the website
- a main view to display all items
- allow the user to login to their account with preset username/passwords
- clicking on any individual product brings the user to a detailed item view
- users can buy a product by clicking on the purchase button, which enables a confirmation/submit view and also provides a confirmation number upon successful transaction
- users can search and filter available items
- users can access all previous transactions
- users can provide feedback on a product, including a numerical rating and an optional text response
