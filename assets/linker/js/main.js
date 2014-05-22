requirejs.config({
    paths: {
      'react': 'bower_components/react/react-with-addons',
      'jquery': 'bower_components/jquery/dist/jquery',
      'jquery.timeago': 'bower_components/jquery-timeago/jquery.timeago',  
      'showdown': 'bower_components/showdown/compressed/showdown',  
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
      'jsx': 'bower_components/requirejsx/jsx',
      'JSXTransformer': 'bower_components/react/JSXTransformer',
      'app': 'linker/js'
    },

    shim: {
        'JSXTransformer': {
            exports: "JSXTransformer"
        }, 
        'jquery.timeago': ["jquery"]
    }
});

require(['jquery', 'react', 'app/app'], function ($, React, CommentBox) {


  $(function whenDomIsReady() {

      // as soon as this file is loaded, connect automatically, 
      var socket = io.connect();
      
      console.log('Connecting to Sails.js...');

      socket.on('connect', function socketConnected() {

        // Subscribe to updates (a sails get or post will auto subscribe to updates)
        socket.get('/comment', function (message) {
          console.log('Listening...');

          // initialize the view with the data property
          React.renderComponent(
            CommentBox({url: '/comment', data:message}),
            document.getElementById('container')
          );

        });

      });

      // Expose connected `socket` instance globally so that it's easy
      // to experiment with from the browser console while prototyping.
      window.socket = socket;

  });
  

});