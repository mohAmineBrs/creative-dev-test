uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;

uniform float uCurrentItem;
uniform float uRaycastUvFade;
uniform float uRaycastUvStrength;
uniform vec2 uRaycastUvCoord;

varying vec2 vUv;

float PI = 3.141592653589793238;

void main() {

    vec4 myTexture1 = texture2D(uTexture1, vUv);
    vec4 myTexture2 = texture2D(uTexture2, vUv);
    vec4 myTexture3 = texture2D(uTexture3, vUv);

    // Setting The Textures to Each Plane in Fragment Shader For More Smoothness In Transition
    vec4 finalTexture = myTexture1;
    if(uCurrentItem == 0.) {
        finalTexture = myTexture1;
    } else if(uCurrentItem == 1.) {
        finalTexture = myTexture2;
    } else if(uCurrentItem == 2.) {
        finalTexture = myTexture3;
    }

    // Wave Effect on Raycasting
    vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    float UvStrength = step(uRaycastUvStrength, abs(distance(wavedUv, uRaycastUvCoord) - uRaycastUvFade));

    gl_FragColor = finalTexture * UvStrength;

}
