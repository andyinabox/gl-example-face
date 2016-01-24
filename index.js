var shell = require('gl-now')();
var createShader = require('gl-shader');
var createTexture = require('gl-texture2d');
var gessoCanvas = require('a-big-triangle');
var glslify = require('glslify');
var clmtrackr = require('clmtrackr');

var videoGrabber = require('./videoGrabber');

var vert = glslify('./shader.vert');
var frag = glslify('./shader.frag');

var video = videoGrabber(600, 400);

var texture, shader;

shell.on('gl-init', function() {
	var gl = shell.gl;
	shader = createShader(gl, vert, frag);
});

shell.on('tick', function() {
	var gl = shell.gl;

		// is there video ready?
	if(video.readyState === video.HAVE_ENOUGH_DATA) {
			if(texture) {
		  	texture.setPixels(video);
			} else {
				texture = createTexture(gl, video);
			} 
	}	
})

shell.on('gl-render', function(t) {
	var gl = shell.gl;

	// bind shader
	shader.bind();

	if(texture) {
	  shader.uniforms.texture = texture.bind()
	}

	// draw big triangle
	gessoCanvas(gl);
});

shell.on("gl-error", function(e) {
  throw new Error("WebGL not supported :(")
});