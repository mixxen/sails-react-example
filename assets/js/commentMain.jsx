requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'reactdom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'jquery.timeago': '/bower_components/jquery-timeago/jquery.timeago',  
      'showdown': '/bower_components/showdown/compressed/Showdown',  
      'bootstrap': '/bower_components/bootstrap/dist/js/bootstrap',
      'app': '/js'
    },

    shim: {
      'jquery.timeago': ["jquery"]
    }
});

require(['jquery', 'react', 'reactdom', 'app/CommentForm', 'app/CommentList'], 
  function ($, React, ReactDOM, CommentForm, CommentList) {


  $(function whenDomIsReady() {

      ReactDOM.render(
        <CommentForm url='/comment'/>,
        document.getElementById('commentForm')
      );

      // as soon as this file is loaded, connect automatically, 
      var socket = io.sails.connect();
      
      console.log('Connecting to Sails.js...');

      // Subscribe to updates (a sails get or post will auto subscribe to updates)
      socket.get('/comment', function (message) {
        console.log('Listening...' + message);

        // initialize the view with the data property
        ReactDOM.render(
          <CommentList url='/comment' data={message} />,
          document.getElementById('commentList')
        );

      });

      // Expose connected `socket` instance globally so that it's easy
      // to experiment with from the browser console while prototyping.
      window.socket = socket;

  });
  

});