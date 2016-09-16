var shell = require('gl-now')();
var createShader = require('gl-shader');
var createTexture = require('gl-texture2d');
var gessoCanvas = require('a-big-triangle');
var glslify = require('glslify');
var clmtrackr = require('clmtrackr');

var videoGrabber = require('./videoGrabber');
var model = require('./node_modules/clmtrackr/models/model_pca_20_svm.json');

var width = 600;
var height = 400;

var vert = glslify('./shader.vert');
var frag = glslify('./shader.frag');

var tracker = new clmtrackr.tracker({useWebGL : true});
var video = videoGrabber(width, height);

// canvas to draw face outline
var faceCanvas = document.createElement('canvas');
faceCanvas.width = width;
faceCanvas.height = height;

var vidTexture, faceTexture, shader;

shell.on('gl-init', function() {
	var gl = shell.gl;
	shader = createShader(gl, vert, frag);
	tracker.init(model);
	tracker.start(video);
});

shell.on('tick', function() {
	var gl = shell.gl;

		// is there video ready?
	if(video.readyState === video.HAVE_ENOUGH_DATA) {
			if(vidTexture) {
		  	vidTexture.setPixels(video);
			} else {
				vidTexture = createTexture(gl, video);
			} 
	}

	if(tracker.getCurrentPosition()) {
		faceCanvas.getContext('2d').clearRect(0, 0, width, height);
		tracker.draw(faceCanvas);

		if(faceTexture) {
	  	faceTexture.setPixels(faceCanvas);
		} else {
			faceTexture = createTexture(gl, faceCanvas);
		} 
	}
})

shell.on('gl-render', function(t) {
	var gl = shell.gl;

	// bind shader
	shader.bind();

	if(vidTexture) {
	  shader.uniforms.vidTexture = vidTexture.bind(0);
	}
	if(faceTexture) {
	  shader.uniforms.faceTexture = faceTexture.bind(1);
	}
	// draw big triangle
	gessoCanvas(gl);
});

shell.on("gl-error", function(e) {
  throw new Error("WebGL not supported :(")
});