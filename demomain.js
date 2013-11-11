var loadingCount = 0;

function loadModule(src, callback) {
  loadingCount++;

  var request = new XMLHttpRequest();
  request.onload = function() {
    loadingCount--;

    var module = {
      exports: {}
    };

    eval(this.responseText);
    if (callback) {
      callback(module.exports);
    }
  };

  request.open('get', src, true);
  request.send();
}

var Module = {};
loadModule('chineseTokenizer.js', function(m) {
  Module['ChineseTokenizer'] = m.ChineseTokenizer;
});

loadModule('cnmodel.5000.js', function(m) {
  Module['BayesModel'] = m;
});

loadModule('placeClassifier.js', function(m) {
  Module['NaiveBayesClassifier'] = m.NaiveBayesClassifier;
});

var tokenizer = null;
var classifier = null;

window.addEventListener('load', function() {
  document.getElementById('classifier').onclick = function() {
    var keywords = document.getElementById('keywords').value.trim();
    if (!keywords) {
      alert('please input content to classify');
      return;
    }

    if (!tokenizer) {
      tokenizer = new Module['ChineseTokenizer'](Module['BayesModel'].logLikelihoods);
    }

    if (!classifier) {
      classifier = new Module['NaiveBayesClassifier'](Module['BayesModel']);
    }

    var tokens = tokenizer.tokenize(keywords, '', '');
    var categories = classifier.classify(tokens);
    alert("keywords: " + tokens + "\n\ncategory: " + categories);
  };
});

