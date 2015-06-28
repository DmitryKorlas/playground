
var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function (comment) {
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				Hello, world! I am a CommentList.
				{commentNodes}
			</div>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				{this.props.children}
				<div>
					{marked(this.props.children.toString())}
				</div>
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = React.findDOMNode(this.refs.author).value.trim();
		var text = React.findDOMNode(this.refs.text).value.trim();
		if (!text || !author) {
			return;
		}
		this.props.onCommentSubmit({author: author, text: text});

		React.findDOMNode(this.refs.author).value = '';
		React.findDOMNode(this.refs.text).value = '';
		return;
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your name" ref="author" />
				<input type="text" placeholder="Say something..." ref="text" />
				<input type="submit" value="Post" />
			</form>
		);
	}
});

var commentStorage = {
	populateStorage: function(id){
		sessionStorage.setItem(id, JSON.stringify([
			{"author": "Pete Hunt", "text": "This is one comment"},
			{"author": "Billy", "text": "This is one more comment"},
			{"author": "Jordan Walke", "text": "This is *another* comment"}
		]));
	},

	getComments: function(id) {
		if (!sessionStorage.getItem(id)) {
			this.populateStorage(id);
		}
		return JSON.parse(sessionStorage.getItem(id))
	},

	addComment: function(storeId, commentRecord) {
		var comments = JSON.parse(sessionStorage.getItem(storeId) || '[]');
		comments.push(commentRecord);
		sessionStorage.setItem(storeId, JSON.stringify(comments));
	}
};

var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	loadCommentsFromServer: function() {
		setTimeout(function(){
			var data = commentStorage.getComments(this.props.url);
			this.setState({data: data});
		}.bind(this), 400);
	},
	handleCommentSubmit: function(commentRecord) {
		console.log('called handleCommentSubmit');
		commentStorage.addComment(this.props.url, commentRecord);
		var data = commentStorage.getComments(this.props.url);
		this.setState({data: data});
	},
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		);
	}
});


React.render(
	<CommentBox url="comments-b.json" pollInterval={2000} />,
	document.getElementById('content')
);
