const path = require('path');
const classifyController = {};

classifyController.classify = (req, res) => {
    res.render('classify.html');
}
module.exports = classifyController;