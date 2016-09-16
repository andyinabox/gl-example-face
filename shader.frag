precision highp float;
uniform sampler2D video;
uniform sampler2D mask;
varying vec2 texCoord;

void main() {
	vec4 color = texture2D(video, texCoord);
	vec4 face = texture2D(mask, texCoord);

	// inverted color
	vec3 inverse = vec3(1.0) - color.rgb;

	// mix based on mask
	vec3 rgb = mix(color.rgb, inverse, face.r);

  gl_FragColor = vec4(rgb, 1.0);
}