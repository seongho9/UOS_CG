

export const loc_aPosition = 0;
export const loc_aNormal = 1;
export const loc_aTexCoord = 2;
export const loc_aColor = 3;
export const src_vert = 
`#version 300 es

layout(location=${loc_aPosition}) in vec4 aPosition;
layout(location=${loc_aNormal}) in vec3 aNormal;
layout(location=${loc_aTexCoord}) in vec2 aTexCoord;
layout(location=${loc_aColor}) in vec4 aColor;

uniform mat4 MVP;
uniform mat4 Model;
uniform sampler2D heightMap;
uniform float uHeightScale;
uniform vec3 uSpotLightPosition;

out vec2 vTexCoord;
out vec3 vNormal;
out vec3 vViewDir;
out vec3 vLightDir;
out vec4 vColor;
out vec3 vPointPos;
void main() 
{
    float height = (texture(heightMap, vec2(1.0 - aTexCoord.x, aTexCoord.y)).r / 1.0) * uHeightScale;

    vec3 offset = normalize(aNormal) * (height/10.0);
    vec4 newPosition = aPosition + vec4(offset, 0.0);

    vec3 PointLightPosition = vec3(15.0, 35.0, 15.0);

    gl_Position = MVP * newPosition;

    //textures coordinate
    vTexCoord = vec2(1.0 - aTexCoord.x, aTexCoord.y);
    //normal
    vNormal = mat3(Model) * aNormal;
    //spot lights direction
    vLightDir = normalize(uSpotLightPosition - (Model * newPosition).xyz);
    vViewDir = normalize(MVP * newPosition).xyz;
    vColor = aColor;
    vPointPos = mat3(MVP) * (PointLightPosition);
}
`;
export const src_frag =
`#version 300 es

precision highp float;

in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vLightDir;
in vec3 vViewDir;
in vec4 vColor;
in vec3 vPointPos;

uniform sampler2D uSampler;
uniform sampler2D uSpecular;
//spot light
uniform vec3 uSpotLightPosition;
uniform float uSpotLightCutoff;

uniform float uSpotEnable;
uniform float uPointEnable;

out vec4 fColor;

void main() 
{
    vec3 PointLightPosition = vec3(15.0, 35.0, 15.0);
    vec3 PointLightColor = vec3(0.4, 0.4, 0.4);
    vec3 SpotLightColor = vec3(4.0, 4.0, 4.0);

    vec4 textureColor = texture(uSampler, vTexCoord);
    vec3 specular = texture(uSpecular, vTexCoord).rgb;
    //vec3 specularMap = vec3((specular.x+1.0)/2.0, (specular.y+1.0)/2.0, (specular.z+1.0)/2.0);
    vec3 specularMap = specular;
    // Calculate Phong Reflection Model for Point Light
    vec3 pointLightDirection = normalize(vPointPos - vViewDir);

    float pointLightDiffuse = max(dot(vNormal, - pointLightDirection), 0.0) * 10.0;
    vec3 pointLightReflection = reflect(pointLightDirection, vNormal);
    vec3 viewReflectionPointLight = normalize(reflect(-vViewDir, vNormal));
    float pointLightSpecular = pow(max(dot(viewReflectionPointLight, pointLightReflection), 0.0), 10.0) * 10.0;

    // Calculate Spotlight
    vec3 spotlightDirection = normalize(uSpotLightPosition - vViewDir);
    float cosTheta = dot(spotlightDirection, normalize(-vLightDir));
    
    float spotlightEffect = uSpotLightCutoff;
    float spotlightDiffuse = max(dot(vNormal, -spotlightDirection), 0.0) * 10.0;
    vec3 spotlightReflection = reflect(-vViewDir, vNormal);
    vec3 viewReflectionSpotlight = normalize(reflect(-vViewDir, vNormal));
    float spotlightSpecular = pow(max(dot(normalize(spotlightDirection), viewReflectionSpotlight), 0.0), 20.0) * 10.0;

    // Calculate point light contribution
    vec3 pointLightContribution = PointLightColor * pointLightDiffuse + PointLightColor * pointLightSpecular;
    //pointLightContribution = uPointEnable == 1.0 ? pointLightContribution : vec3(0.0);
    pointLightContribution = vec3(0.0);
    // Calculate spotlight contribution
    vec3 spotlightContribution = SpotLightColor * spotlightDiffuse * spotlightEffect + specularMap * spotlightEffect * SpotLightColor * spotlightSpecular;
    spotlightContribution = uSpotEnable == 1.0 ? spotlightContribution : vec3(0.0);
    // Calculate final color (diffuse + ambient + specular)
    vec3 ambientColor = vec3(2.0, 2.0, 2.0);
    vec3 ambient = ambientColor * textureColor.rgb;

    vec3 finalColor = ambient * (textureColor.rgb + pointLightContribution + spotlightContribution);

    // Apply the alpha value
    float alpha = textureColor.a;
    fColor = vec4(finalColor, alpha) + vColor;
}
`;