precision highp float;
uniform sampler2D texture;
varying vec2 texCoord;
void main() {
	vec4 color = texture2D(texture, texCoord);
	float avg = (color.r + color.g + color.b) / 3.0;
	vec3 rgb = vec3(avg);
  gl_FragColor = vec4(rgb, color.a);
}