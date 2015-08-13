var models = require('../models/models.js');

var statistics = {
  questions: 0,
  comments: 0,
  median: 0,
  commenteds: 0,
  uncommenteds: 0
}

exports.show = function(req, res) {
  models.Quiz.count().then(function(questions) {
    statistics.questions = questions;
    statistics.median = 1 / questions;
    return models.Comment.count();
  })
  .then(function(comments) {
    statistics.comments = comments;
    statistics.median = (statistics.median * comments).toFixed(2);
    return models.Comment.count({ include: models.Quiz });
  })
  .then(function(commenteds) {
    statistics.commenteds = commenteds;
    statistics.uncommenteds = statistics.questions - commenteds;
  })
  .catch(function(error) {
    next(error);
  }).finally(function() {
    res.render('quizes/statistics', { statistics: statistics, errors: []});
  });
};
