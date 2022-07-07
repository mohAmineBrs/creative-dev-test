uniform sampler2D uTexture;

uniform float uRaycastUvFade;
uniform float uRaycastUvStrength;
uniform vec2 uRaycastUvCoord;

varying vec2 vUv;

float PI = 3.141592653589793238;

void main() {

    vec4 myTexture = texture2D(uTexture, vUv);

    // Wave Effect on Raycasting
    vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    float UvStrength = step(uRaycastUvStrength, abs(distance(wavedUv, uRaycastUvCoord) - uRaycastUvFade));

    gl_FragColor = myTexture * UvStrength;

}
