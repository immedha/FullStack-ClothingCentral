/*
 * This is the index.js page that adds functionality to the ClothingCentral website. It allows
 * useres to search through items, log in, purchase items, and give feedback.
 */
"use strict";
(function() {
  const INTERNAL_ERR = 500;
  const CLIENT_ERR = 400;
  const EXTRA_ARG = 4;
  const ROUND_NUM = 10;
  const MAX_RATING = 5;

  window.addEventListener("load", init);

  /**
   * Displays main view with all products.
   */
  async function init() {
    id("search-btn").addEventListener("click", async () => {
      await viewItem(qs("#search > input").value, "main-view");
    });
    id("home-btn").addEventListener("click", viewHome);
    id("men").addEventListener("click", filterResults);
    id("women").addEventListener("click", filterResults);
    id("vip").addEventListener("click", filterResults);
    id("history-btn").addEventListener("click", viewTransHistory);
    id("login-view-btn").addEventListener("click", viewLogin);
    qs("form").addEventListener("submit", logIn);
    id("logout-btn").addEventListener("click", logOut);
    id("main-format").addEventListener("click", toggleFormat);
    await loadAllItems();
  }

  /**
   * Toggles a list or grid view for items in the main view.
   */
  function toggleFormat() {
    let view = id("main-view");
    view.classList.toggle("list-format");
    if (view.classList.contains("list-format")) {
      id("main-format").textContent = "Grid View";
    } else {
      id("main-format").textContent = "List View";
    }
  }

  /**
   * Displays the homepage and all products in it.
   */
  async function viewHome() {
    changeView("main-view", true);
    await loadAllItems();
  }

  /**
   * Displays the login page.
   */
  async function viewLogin() {
    changeView("login-view", false);
    resetErrors();
    try {
      let alreadyExists = await cookieStore.get("user");
      await enableLogin(!alreadyExists);
    } catch (err) {
      handleError("search", INTERNAL_ERR, err);
    }
  }

  /**
   * Resets any errors that were previously shown.
   */
  function resetErrors() {
    let errors = qsa(".error-text");
    for (let i = 0; i < errors.length; i++) {
      errors[i].remove();
    }
  }

  /**
   * Logs the user out of the website.
   */
  async function logOut() {
    resetErrors();
    try {
      await cookieStore.delete("user");
      qs("form").reset();
      await enableLogin(true);
    } catch (err) {
      handleError("login-view", INTERNAL_ERR, err);
    }
  }

  /**
   * Toggles login functionality.
   * @param {Boolean} yes - whether to allow or forbid the user from logging in
   */
  async function enableLogin(yes) {
    resetErrors();
    try {
      id("login-btn").disabled = !yes;
      id("logout-btn").disabled = yes;
      if (yes) {
        qs("#login-view > h2").textContent = "Log In!";
      } else {
        let username = await cookieStore.get("user");
        qs("#login-view > h2").textContent = "You are signed in as: " + username.value;
      }
    } catch (err) {
      handleError("login-view", INTERNAL_ERR, err);
    }
  }

  /**
   * Logs the user in based on their given username and password
   * @param {Event} evt - the login form being submitted
   */
  async function logIn(evt) {
    evt.preventDefault();
    resetErrors();
    const username = id("username").value;
    const password = id("pwd").value;
    let data = new FormData();
    data.append("user", username);
    data.append("pwd", password);
    let statusCode = INTERNAL_ERR;
    try {
      let res = await fetch("/central/login", {method: "POST", body: data});
      statusCode = res.status;
      await statusCheck(res);
      await enableLogin(false);
    } catch (err) {
      handleError("login-view", statusCode, err);
    }
  }

  /**
   * Loads either all items or items of a specific category in the main view
   * @param {String} category - product category (men, women, VIP)
   */
  async function loadAllItems(category) {
    let statusCode = INTERNAL_ERR;
    resetErrors();
    try {
      let endpoint = "/central/items";
      if (arguments.length === 1) {
        endpoint += "?category=" + category;
      }
      let res = await fetch(endpoint);
      statusCode = res.status;
      await statusCheck(res);
      res = await res.json();
      for (let i = 0; i < res.length; i++) {
        createBasicCard("main-view", res[i]);
      }
    } catch (err) {
      handleError("main-view", statusCode, err);
    }
  }

  /**
   * Displays an error on the page when it occurs.
   * @param {String} container - where to display the error
   * @param {Integer} statusCode - the type of error that occurred
   * @param {String} err - the error text
   * @param {String} diffAppend - a specific way the error should be displayed
   */
  function handleError(container, statusCode, err, diffAppend) {
    let errorText = gen("p");
    errorText.classList.add("error-text");
    if (arguments.length === EXTRA_ARG && diffAppend === "after") {
      id(container).after(errorText);
    } else {
      id(container).appendChild(errorText);
    }
    if (statusCode && statusCode === CLIENT_ERR) {
      errorText.textContent = err;
    } else {
      errorText.textContent = "Internal error. Please try again.";
    }
  }

  /**
   * Displays a card containing basic product information in the given view
   * @param {String} container - which view to add the card to
   * @param {Object} info - information about the card
   * @returns {Element} - the card that was created
   */
  function createBasicCard(container, info) {
    let card = gen("section");
    id(container).appendChild(card);
    card.id = info.id;

    let itemImg = gen("img");
    let nameParts = info["item_name"].split(" ");
    let category = nameParts[0].split("'");

    // images are from Google Images and from Marina's favorites
    let src = "img/" + category[0].toLowerCase();
    src += ("-" + nameParts[1] + "-" + nameParts[2] + ".jpg");
    itemImg.src = src;
    itemImg.alt = info["item_name"];
    card.appendChild(itemImg);

    let name = gen("h2");
    name.textContent = info["item_name"];
    name.classList.add("title");
    name.addEventListener("click", async () => {
      await viewItem(name.textContent, "item-view");
    });
    card.appendChild(name);
    card.appendChild(name);

    let price = gen("h2");
    price.textContent = "$" + info.price;
    card.appendChild(price);
    return card;
  }

  /**
   * Displays a card containing detailed product information in the given view
   * @param {String} view - which view to add the card to
   * @param {*} info - information about the card
   */
  async function createDetailedCard(view, info) {
    let card = createBasicCard(view, info);
    let stock = gen("h2");
    if (info.stock) {
      stock.textContent = "Number available: " + info.stock;
    } else {
      stock.textContent = "Item is available";
    }
    card.appendChild(stock);
    let id = gen("h2");
    id.textContent = "Id: " + info.id;
    card.appendChild(id);
    let category = gen("h2");
    category.textContent = "Category: " + info.category;
    card.appendChild(category);
    let subcategory = gen("h2");
    subcategory.textContent = "Subcategory: " + info.subcategory;
    card.appendChild(subcategory);
    let purchaseBtn = gen("button");
    purchaseBtn.id = "purchase-btn";
    purchaseBtn.textContent = "Purchase Item";
    purchaseBtn.addEventListener("click", async () => {
      await purchaseItem(info);
    });
    card.appendChild(purchaseBtn);
    card.appendChild(gen("hr"));
    requestFeedback(card);
    await displayFeedback(info.id);
  }

  /**
   * Displays options to provide a numerical rating from 1-5 and a written response about the
   * given product.
   * @param {Element} card - the product card to request feedback on
   */
  function requestFeedback(card) {
    let feedback = gen("section");
    card.appendChild(feedback);
    feedback.id = "feedback-section";
    let feedbackTitle = gen("h2");
    feedbackTitle.textContent = "Give a rating:";
    feedback.appendChild(feedbackTitle);

    let options = gen("section");
    for (let i = 1; i <= MAX_RATING; i++) {
      let btn = gen("button");
      btn.classList.add("feedback-btn");
      btn.addEventListener("click", chooseOption);
      options.appendChild(btn);
    }
    feedback.appendChild(options);
    requestResponse(feedback);
  }

  /**
   * Displays an option to provide a written response about a product
   * @param {Element} feedback - the element to add the response option to
   */
  function requestResponse(feedback) {
    let optionalText = gen("textarea");
    optionalText.placeholder = "Explain...";
    feedback.appendChild(optionalText);

    let submitRatingBtn = gen("button");
    submitRatingBtn.id = "submit-rating";
    submitRatingBtn.textContent = "Submit Rating";
    submitRatingBtn.addEventListener("click", storeFeedback);
    feedback.appendChild(submitRatingBtn);

    let rule = gen("hr");
    feedback.appendChild(rule);
  }

  /**
   * Stores feedback that was submitted about a product
   */
  async function storeFeedback() {
    let statusCode = INTERNAL_ERR;
    resetErrors();
    try {
      let loggedIn = await cookieStore.get("user");
      if (loggedIn) {
        let chosenOptions = qsa(".choose-rating");
        let rating = chosenOptions.length;
        let data = new FormData();
        data.append("item", parseInt(this.parentNode.parentNode.id));
        data.append("rating", rating);
        if (qs("textarea").value !== "") {
          data.append("response", qs("textarea").value);
        }
        let res = await fetch("/central/add_feedback", {method: "POST", body: data});
        statusCode = res.status;
        await statusCheck(res);
      } else {
        notLoggedIn("submit-rating", "after");
      }
    } catch (err) {
      handleError("submit-rating", statusCode, err, "after");
    }
  }

  /**
   * Displays feedback that was submitted for an item
   * @param {Integer} itemId - the id of the item that the feedback was given for
   */
  async function displayFeedback(itemId) {
    resetErrors();
    let textFeedback = gen("section");
    id("feedback-section").appendChild(textFeedback);
    let avgRating = gen("h2");
    avgRating.textContent = "Average Rating: ";
    textFeedback.appendChild(avgRating);
    let statusCode = INTERNAL_ERR;
    try {
      let res = await fetch("/central/get_ratings/" + itemId);
      statusCode = res.status;
      await statusCheck(res);
      res = await res.json();
      let numRatings = res.length;
      if (numRatings === 0) {
        avgRating.textContent += "None";
      } else {
        let totalRating = 0;
        for (let i = 0; i < res.length; i++) {
          showRatings(textFeedback, res[i]);
          totalRating += res[i].rating;
        }
        avgRating.textContent += Math.round(totalRating / numRatings * ROUND_NUM) / ROUND_NUM;
      }
    } catch (err) {
      handleError("feedback-section", statusCode, err);
    }
  }

  /**
   * Displays the rating and written response for a specific submitted feedback
   * @param {Element} textFeedback - the element to show the ratings for
   * @param {Object} res - information about the rating
   */
  function showRatings(textFeedback, res) {
    let rating = res.rating;
    let user = res.username;
    let date = gen("h2");
    date.textContent = "Date: " + (new Date(res["feedback_time"])).toLocaleString();
    textFeedback.appendChild(date);
    let title = gen("h2");
    title.textContent = user + " rated this item " + rating + "/5.";
    textFeedback.appendChild(title);
    let response = res.response;
    if (response) {
      title.textContent += " They commented: ";
      let responseText = gen("p");
      responseText.textContent = response;
      textFeedback.appendChild(responseText);
    }
  }

  /**
   * Displays a specific product.
   * @param {String} itemName - the name of the product
   * @param {String} view - which view to display the product in
   */
  async function viewItem(itemName, view) {
    changeView(view, true);
    resetErrors();
    let data = new FormData();
    data.append("term", itemName);
    let statusCode = INTERNAL_ERR;
    try {
      let res = await fetch("/central/search/", {method: "POST", body: data});
      statusCode = res.status;
      await statusCheck(res);
      res = await res.json();
      if (view === "item-view") {
        await createDetailedCard(view, res);
      } else {
        createBasicCard(view, res);
      }
    } catch (err) {
      handleError(view, statusCode, err);
    }
  }

  /**
   * Filters the products based on which filter button was clicked.
   */
  async function filterResults() {
    changeView("main-view", true);
    await loadAllItems(this.id);
  }

  /**
   * Creates a transaction when an item is purchased.
   * @param {Object} info - information about the item
   */
  async function purchaseItem(info) {
    let statusCode = INTERNAL_ERR;
    resetErrors();
    try {
      let loggedIn = await cookieStore.get("user");
      if (loggedIn) {
        changeView("purchase-view", true);
        let card = createBasicCard("purchase-view", info);
        let confirmBtn = gen("button");
        card.appendChild(confirmBtn);
        confirmBtn.textContent = "Confirm Transaction";
        confirmBtn.id = "confirm-trans-btn";
        confirmBtn.addEventListener("click", () => {
          confirmPurchase(card, info);
        });
      } else {
        notLoggedIn("purchase-btn", "after");
      }
    } catch (err) {
      handleError("purchase-btn", statusCode, err, "after");
    }
  }

  /**
   * Confirms the purchase.
   * @param {Element} card - the card about the product being purchased
   * @param {Object} info - information about the product being purchased
   */
  function confirmPurchase(card, info) {
    id("confirm-trans-btn").remove();
    let submitBtn = gen("button");
    submitBtn.textContent = "Submit transaction!";
    card.appendChild(submitBtn);
    submitBtn.id = "submit-trans-btn";
    submitBtn.addEventListener("click", async () => {
      await submitPurchase(card, info);
    });
  }

  /**
   * Submits the purchase and displays a confirmation number for the user.
   * @param {Element} card - the card about the product being purchased
   * @param {Object} info - information about the product being purchased
   */
  async function submitPurchase(card, info) {
    let data = new FormData();
    data.append("item", info.id);
    let statusCode = INTERNAL_ERR;
    resetErrors();
    try {
      let res = await fetch("/central/purchase", {method: "POST", body: data});
      statusCode = res.status;
      await statusCheck(res);
      res = await res.json();
      let confirmationText = gen("p");
      confirmationText.textContent = "Success! Your confirmation number is " + res.confirm;
      card.appendChild(confirmationText);
      id("submit-trans-btn").disabled = true;
    } catch (err) {
      handleError(card.id, statusCode, err);
      id("submit-trans-btn").disabled = true;
    }
  }

  /**
   * Displays the user's transaction history.
   */
  async function viewTransHistory() {
    changeView("history-view", true);
    let statusCode = INTERNAL_ERR;
    resetErrors();
    try {
      let loggedIn = await cookieStore.get("user");
      if (loggedIn) {
        let res = await fetch("/central/history");
        statusCode = res.status;
        await statusCheck(res);
        res = await res.json();
        for (let i = 0; i < res.length; i++) {
          let transaction = res[i];
          let card = createBasicCard("history-view", transaction);
          let transDate = gen("h2");
          let date = (new Date(transaction["trans_time"])).toLocaleString();
          transDate.textContent = "Date: " + date;
          card.prepend(transDate);
          let confirmNum = gen("h2");
          confirmNum.textContent = "Confirm #: " + transaction["confirm_num"];
          card.prepend(confirmNum);
        }
      } else {
        notLoggedIn("history-view");
      }
    } catch (err) {
      handleError("history-view", statusCode, err);
    }
  }

  /**
   * Displays a warning that the user is not logged in.
   * @param {String} view - which view to display the warning in
   * @param {String} diffAppend - a specific way to display the warning
   */
  function notLoggedIn(view, diffAppend) {
    let warning = gen("h2");
    warning.classList.add("error-text");
    warning.textContent = "Please log in first!";
    if (arguments.length === 2 && diffAppend === "after") {
      id(view).after(warning);
    } else {
      id(view).appendChild(warning);
    }
  }

  /**
   * Displays a new view.
   * @param {String} view - which view to display
   * @param {Boolean} empty - whether to clear the view
   */
  function changeView(view, empty) {
    qs("#search > input").value = "";
    if (empty) {
      id(view).innerHTML = "";
    }
    let views = qsa("main > section");
    for (let i = 0; i < views.length; i++) {
      if (views[i].id === view) {
        id(views[i].id).classList.remove("hidden");
      } else {
        id(views[i].id).classList.add("hidden");
      }
    }
  }

  /**
   * Toggles whether a rating is clicked.
   */
  function chooseOption() {
    this.classList.toggle("choose-rating");
  }

  /**
   * Checks the status of an API response
   * @param {Object} res - response from API request
   * @returns {Object} response if in ok range, otherwise returns error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Creates a new HTML element.
   * @param {String} type - the type of element
   * @returns {Element} the created element
   */
  function gen(type) {
    return document.createElement(type);
  }

  /**
   * Gets an element that has a given id
   * @param {String} id - the id that identifies an element
   * @returns {Object} an element with the given id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Gets all elements that can be identified by a given selector
   * @param {String} selector - a selector to identify element(s)
   * @returns {Array} an array of elements that can be identified by the selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Gets the first element that can be identified by a given selector
   * @param {String} selector  - a selector to identify an element
   * @returns {Element} an element that is identified by the given selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();