var CommentListManual = React.createClass({
	render: function() {
		return (
			<div className="commentList">
				Hello, world! I am a CommentListManual.
				<Comment author="Pete Hunt">This is one comment</Comment>
				<Comment author="Jordan Walke">This is *another* comment</Comment>
			</div>
		);
	}
});

var CommentListAuto = React.createClass({
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
				Hello, world! I am a CommentListAuto.
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
	render: function() {
		return (
			<div className="commentForm">
			Hello, world! I am a CommentForm.
		</div>
		);
	}
});

var CommentBox = React.createClass({
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentListManual />
				<hr />
				<CommentListAuto data={data} />
				<CommentForm />
			</div>
		);
	}
});

var data = [
	{author: "Pete Hunt", text: "This is one comment"},
	{author: "Jordan Walke", text: "This is *another* comment"}
];


React.render(
	React.createElement(CommentBox, null),
	document.getElementById('content')
);
