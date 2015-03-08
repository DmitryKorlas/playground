var exports = {};


exports.canvasRenderer = (function() {
	// renderer based on http://threejs.org/examples/webgl_kinect.html
	function run(shaders) {
		var container;

		var scene, camera, light, renderer;
		var geometry, cube, mesh, material;
		var mouse, center;
		var stats;

		var video, texture;

		init();
		animate();

		function init() {

			container = document.createElement('div');
			document.body.appendChild(container);

			stats = new Stats();
			stats.domElement.style.position = 'fixed';
			stats.domElement.style.bottom = '0px';
			container.appendChild( stats.domElement );

			camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.set(0, 0, 500);

			scene = new THREE.Scene();
			center = new THREE.Vector3();
			center.z = -1000;

			//video = document.createElement( 'video' );
			video = document.querySelector('.shader-stream');
			video.addEventListener('loadedmetadata', function (event) {

				texture = new THREE.VideoTexture(video);
				texture.minFilter = THREE.NearestFilter;

				var width = 640, height = 480;
				var nearClipping = 850, farClipping = 4000;

				geometry = new THREE.BufferGeometry();

				var vertices = new Float32Array(width * height * 3);

				for (var i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {

					vertices[i] = j % width;
					vertices[i + 1] = Math.floor(j / width);

				}

				geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

				material = new THREE.ShaderMaterial({

					uniforms: {

						"map": {type: "t", value: texture},
						"width": {type: "f", value: width},
						"height": {type: "f", value: height},
						"nearClipping": {type: "f", value: nearClipping},
						"farClipping": {type: "f", value: farClipping},

						"pointSize": {type: "f", value: 2},
						"zOffset": {type: "f", value: 1000}

					},
					vertexShader: shaders.vertex,
					fragmentShader: shaders.fragment,
					blending: THREE.AdditiveBlending,
					depthTest: false, depthWrite: false,
					transparent: true

				});

				mesh = new THREE.PointCloud(geometry, material);
				scene.add(mesh);

				var gui = new dat.GUI();
				gui.add(material.uniforms.nearClipping, 'value', 1, 10000, 1.0).name('nearClipping');
				gui.add(material.uniforms.farClipping, 'value', 1, 10000, 1.0).name('farClipping');
				gui.add(material.uniforms.pointSize, 'value', 1, 10, 1.0).name('pointSize');
				gui.add(material.uniforms.zOffset, 'value', 0, 4000, 1.0).name('zOffset');
				gui.close();


			}, false);

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(renderer.domElement);

			mouse = new THREE.Vector3(0, 0, 1);

			document.addEventListener('mousemove', onDocumentMouseMove, false);

			window.addEventListener('resize', onWindowResize, false);
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		function onDocumentMouseMove(event) {
			mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
			mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;
		}

		function animate() {
			requestAnimationFrame(animate);

			render();
			stats.update();
		}

		function render() {

			camera.position.x += ( mouse.x - camera.position.x ) * 0.05;
			camera.position.y += ( -mouse.y - camera.position.y ) * 0.05;
			camera.lookAt(center);

			renderer.render(scene, camera);
		}
	}
	return {
		run: run
	}
})();


exports.streamController = (function(){
	function run() {
		navigator.getUserMedia = ( navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);


		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				// constraints
				{
					video: true,
					audio: false
				},

				// successCallback
				function (localMediaStream) {
					var video = document.querySelector('.original-stream');
					var shaderVideo = document.querySelector('.shader-stream');

					bindMediaStream(localMediaStream, video);
					bindMediaStream(localMediaStream, shaderVideo);

				},

				// errorCallback
				function (err) {
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
			element.onloadedmetadata = function (e) {
				console.log('onloadedmetadata called');
				// Do something with the video here.
			};
			// Do something with the video here, e.g. video.play()

			element.autoplay = true;
			element.play();
		}

		$('.video-box').click(function (event) {
			$('video', event.delegateTarget).toggle();
		});
	}

	return {
		run: run
	}

})();

exports.featureDetector = (function() {
	function isWebglAvailable() {
		try {
			var canvas = document.createElement("canvas");
			return !!
					window.WebGLRenderingContext &&
				(canvas.getContext("webgl") ||
				canvas.getContext("experimental-webgl"));
		} catch(e) {
			return false;
		}
	}
	function run() {
		exports.webgl = isWebglAvailable();
	}

	var exports = {
		run: run
	};
	return exports;
})();


///////////////////////////////////////////////////////////////////////////////
// Run it

exports.featureDetector.run();

exports.streamController.run();
if (exports.featureDetector.webgl) {
	require([
			'text!kinect.vertex.glsl',
			'text!kinect.fragment.glsl'
		],
		function(vertex, fragment) {
			exports.canvasRenderer.run({vertex:vertex, fragment:fragment});
	});
}
else {
	$('body').append($([
			'<p style="background: #fff; color: #000; padding: 2em;">',
			'Your system does not seem to support ',
			'<a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.',
			'<br />',
			'Visit <a href="http://get.webgl.org/" style="color:#000">this page</a>.',
			'</p>'
		].join('')
	));
}
