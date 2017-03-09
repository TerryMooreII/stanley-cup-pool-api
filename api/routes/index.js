exports.init = function(server) {
  console.log('Loading routes');

  require('./user')(server);
  require('./team')(server);
  require('./league')(server);
  require('./bracket')(server);
  require('./pick')(server);
  require('./login')(server);

  //Must be last route!
  //Loads the static web content.
  //require('./static')(server);
};
