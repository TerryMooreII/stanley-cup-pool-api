
const uuid4 = require('uuid4');


//Used to store the user to uuid hash
var authenticated = {};

var store = function(user){
  var data = {
    apikey: uuid4(),
    loginDate: Date.now()
  };

  authenticated[user._id] = data;
  return data;
};


var isAuthenticated = function(user, apikey){
  var authUser = authenticated[user._id];
  if (!authUser || authUser.apikey !== apikey){
    return false;
  };

  return true;
};


var logout = function(user){
  delete authenticated[user._id];
}

module.exports = {
  store: store,
  isAuthenticated: isAuthenticated,
  logout: logout
};
