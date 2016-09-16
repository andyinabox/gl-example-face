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

var videoTexture, maskTexture, shader;

function drawPositions(canvas, p) {
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#000000';

	ctx.beginPath();

	// create polygon with face points
	for(var i = 0; i <= 18; i++) {
		if(i === 0) {
			ctx.moveTo(p[i][0], p[i][1]);
		} else {
			ctx.lineTo(p[i][0], p[i][1]);
		}
	}

	// left eyebrow is in wrong order to do
	// automatically
	ctx.lineTo(p[22][0], p[22][1]);
	ctx.lineTo(p[21][0], p[21][1]);
	ctx.lineTo(p[20][0], p[20][1]);
	ctx.lineTo(p[19][0], p[19][1]);

	ctx.closePath();
	ctx.fill();
}


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
			if(videoTexture) {
		  	videoTexture.setPixels(video);
			} else {
				videoTexture = createTexture(gl, video);
			} 
	}

	var positions = tracker.getCurrentPosition()
	var ctx = faceCanvas.getContext('2d');

	if(positions) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		// tracker.draw(faceCanvas);
		drawPositions(faceCanvas, positions);

		if(maskTexture) {
	  	maskTexture.setPixels(faceCanvas);
		} else {
			maskTexture = createTexture(gl, faceCanvas);
		} 
	} else {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);		
	}
})

shell.on('gl-render', function(t) {
	var gl = shell.gl;

	// bind shader
	shader.bind();

	// bind textures
	if(videoTexture) {
	  shader.uniforms.video = videoTexture.bind(0);
	}
	if(maskTexture) {
	  shader.uniforms.mask = maskTexture.bind(1);
	}
	// draw big triangle
	gessoCanvas(gl);
});

shell.on("gl-error", function(e) {
  throw new Error("WebGL not supported :(")
});