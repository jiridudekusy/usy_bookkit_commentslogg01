"use strict";
const BookkitCommentslogAbl = require("../../abl/bookkit-commentslog-abl.js");

class BookkitCommentslogController {
  init(ucEnv) {
    return BookkitCommentslogAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new BookkitCommentslogController();
