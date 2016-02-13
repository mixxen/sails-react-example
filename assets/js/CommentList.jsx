define(['react', 'showdown', 'jquery', 'jquery.timeago'], 
  function(React, Showdown, $) {

var converter = new Showdown.converter();
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var CommentList = React.createClass({

  //could be optimized to render changes instead of pulling everything
  loadCommentsFromServer: function(message) { 
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: this.props.data};
  },

  componentWillMount: function() {
    var func = this.loadCommentsFromServer;
    // Listen for Comet messages from Sails
    socket.on('comment', function whenMessageRecevied(message) {
      console.log('New comet message received :: ', message);
      func(message);
    });
  },

  render: function() {
    var url = this.props.url;
    var commentNodes = this.state.data.reverse().map(function (comment, index) {
      return (
        <Comment key={comment.id} author={comment.author} time={comment.createdAt} url={url} commentid={comment.id}>
          {comment.text}
        </Comment>);
    });
    return (
      <div className="commentList">
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {commentNodes}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}); //CommentList

var Comment = React.createClass({

  handleClick: function(e) {
    console.log('click occured ' + e + ' to ' + this.props.url);
    socket.delete(this.props.url + '/' + this.props.commentid, function whenServerResponds(data) {
      console.log('Message deleted :: ', data);
    });  
  },

  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    var t = new Date(this.props.time);
    return (
      <div className="comment">
        <hr />
        <h4 className="commentAuthor">{this.props.author} <small> commented {$.timeago(t)}</small>
          <button type="button" className="close" aria-hidden="true" onClick={this.handleClick}>&times;</button>          
        </h4>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
}); //Comment


return CommentList;


}); //define



