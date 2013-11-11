var hash = [];
var sep = /\s|-|_|,|\.|\?|、|，|。|；|？|……/;

function addWord(s) {
  var n = s.length;
  if (!hash[n]) {
    hash[n] = {};
  }
  hash[n][s] = true;
}

function init(likelihoods) {
  has = [];
  for (var key in likelihoods) {
    addWord(key);
  }
}

function seg(sen) {
  var max = Math.min(sen.length, hash.length - 1);
  for (var n = max; n > 0; n--) {
    if (!hash[n]) {
      continue;
    }
    var section = sen.slice(sen.length - n);
    if (hash[n][section]) {
      return sen.length >= n
        ? seg(sen.slice(0, sen.length - n)).concat([section])
        : [];
    }
  }
  return sen.length >= 1
    ? seg(sen.slice(0, sen.length - 1))
    : [];
}

// Init dictionary from the likelihoods of bayes model
function ChineseTokenizer(likelihoods) {
  init(likelihoods);
}

ChineseTokenizer.prototype.tokenize = function(aUrl, aTitle, keywords) {
  return seg(aUrl + ' ' + keywords);
};

module.exports.ChineseTokenizer = ChineseTokenizer;

