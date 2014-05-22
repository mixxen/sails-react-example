/** @jsx React.DOM */

define(['react', 'jquery', 'showdown', 'jquery.timeago'], function(React, $, Showdown) {

var converter = new Showdown.converter();
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var CommentBox = React.createClass({

  //could be optimized to render changes instead of pulling everything
  loadCommentsFromServer: function(message) { 
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    socket.post(this.props.url, comment, function whenServerResponds(data) {
      console.log('Message posted :: ', data);
    });
  },
  getInitialState: function() {
    return {data: this.props.data};
  },
  componentWillMount: function() {
    var func = this.loadCommentsFromServer;
    // Listen for Comet messages from Sails
    socket.on('message', function whenMessageRecevied(message) {
      console.log('New comet message received :: ', message);
      func(message);
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList url={this.props.url} data={this.state.data} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var url = this.props.url;
    var commentNodes = this.props.data.reverse().map(function (comment, index) {
      return (
        <Comment key={comment.id} author={comment.author} time={comment.createdAt} url={url}>
          {comment.text}
        </Comment>);
    });
    return (
      <div className="commentList">
        <ReactCSSTransitionGroup transitionName="example">
          {commentNodes}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

var Comment = React.createClass({

  handleClick: function(e) {
    console.log('click occured ' + e + ' to ' + this.props.url);
    socket.delete(this.props.url + '/' + this.props.key, function whenServerResponds(data) {
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
});



var CommentForm = React.createClass({
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit} role="form">
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" type="text" placeholder="Your name" ref="author" />
        </div>
        <div className="form-group">
          <label>Comment</label>
          <input className="form-control" placeholder="Markdown something..." ref="text" />
        </div>
          <button type="submit" className="btn btn-default" value="Submit">Submit</button>
      </form>
    );
  }
});

return CommentBox;


}); //define



