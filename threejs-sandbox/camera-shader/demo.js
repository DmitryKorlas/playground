(function(){

	navigator.getUserMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);


if (navigator.getUserMedia) {
	navigator.getUserMedia (

		// constraints
		{
			video: true,
			audio: false
		},

		// successCallback
		function(localMediaStream) {
			var video = document.querySelector('.original-stream');
			var shaderVideo = document.querySelector('.shader-stream');

			bindMediaStream(localMediaStream, video);
			bindMediaStream(localMediaStream, shaderVideo);

		},

		// errorCallback
		function(err) {
			console.log("The following error occured: " + err);
		}
	);
} else {
	console.log("getUserMedia not supported");
}

	/**
	 * Bind media stream to ui video element
 	 * @param {MediaStream} localMediaStream Stream from user camera
	 * @param {HTMLVideoElement} element DOM <video/> element
	 */
function bindMediaStream(localMediaStream, element) {
	var url = window.URL.createObjectURL(localMediaStream);
	element.src = url;
	//video.src = localMediaStream; // for older firefox/opera
	element.onloadedmetadata = function(e) {
		console.log('onloadedmetadata called');
		// Do something with the video here.
	};
	// Do something with the video here, e.g. video.play()

	element.autoplay = true;
	element.play();
}
})();
