precision highp float;
uniform sampler2D vidTexture;
uniform sampler2D faceTexture;
varying vec2 texCoord;
void main() {
	vec4 vid = texture2D(vidTexture, texCoord);
	vec4 face = texture2D(faceTexture, texCoord);
	vec3 rgb = vid.rgb;
	vec3 inverse = vec3(1.0) - rgb;
	rgb = mix(rgb, inverse, face.r);
  gl_FragColor = vec4(rgb, 1.0);
}