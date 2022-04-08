const path = require('path');
const artController = {};

artController.article = (req, res) => {
    res.render('article.html');
}
module.exports = artController;