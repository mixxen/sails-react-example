/** @jsx React.DOM */

define(['react'], function(React) {


var CommentForm = React.createClass({
  
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.onCommentSubmit({author: author, text: text});
    this.refs.text.getDOMNode().value = '';
    return false;
  },

  onCommentSubmit: function(comment) {
    socket.post(this.props.url, comment, function whenServerResponds(data) {
      console.log('Message posted :: ', data);
    });
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

}); //CommentForm

return CommentForm;

}); //define
