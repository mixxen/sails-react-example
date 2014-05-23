requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'app': '/linker/js'
    },
});

require(['react', 'app/TodoModel', 'app/TodoApp'], 
  function (React, TodoModel, TodoApp) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();

  var model = new TodoModel('/todo', socket);

  function render() {

    React.renderComponent(
      TodoApp({model: model}),
      document.getElementById('todoapp')
    );
  }

  
  console.log('Connecting to Sails.js...');

  socket.on('connect', function socketConnected() {

    // Subscribe to updates (a sails get or post will auto subscribe to updates)
    socket.get('/todo', function (message) {

      console.log('Listening...' + JSON.stringify(message));

      // initialize the view with the data property
      model.set(message);
      model.subscribe(render);
      render();

    });

    socket.on('message', function whenMessageRecevied(message) {
      console.log('New comet message received :: ', message);

      // brute force it. should really check the type of message and respond accordingly.
      // for now we just update the whole list
      socket.get('/todo', function (todos) {
        model.set(todos);
      });

    });

  }); //socket.on

}); //require