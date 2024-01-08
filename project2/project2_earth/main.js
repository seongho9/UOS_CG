import * as mat4 from "./lib/gl-matrix/mat4.js";
import {toRadian} from "./lib/gl-matrix/common.js";
import init_sphere from "./modules/sphere.js";
import loadTextures from "./modules/texture.js";
import createProgram from "./modules/program.js";
import render_scene from "./modules/render.js";
import { src_vert, src_frag, loc_aPosition, loc_aTexCoord, loc_aNormal} from "./modules/shader.js";
"use strict";

function slider_callback(id, callback){
    document.getElementById(id).oninput = callback;
}
function calcSpotLightPos(radius, latitude, longitude) {
    const theta = toRadian(90.0+latitude);
    const phi = toRadian(180.0 + longitude);

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    return [x, y, z];
}

function main() {


    // Getting the WebGL context
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext("webgl2");
 
    const h_prog = createProgram(gl, src_vert, src_frag);

    if(!h_prog){
        console.error("Failed to create shader program");
        return;
    }

    const loc_MVP = gl.getUniformLocation(h_prog, "MVP");
    const loc_M = gl.getUniformLocation(h_prog, "Model");
    const loc_height = gl.getUniformLocation(h_prog, "heightMap");
    const loc_Sampler = gl.getUniformLocation(h_prog, "uSampler");
    const loc_scale = gl.getUniformLocation(h_prog, "uHeightScale");
    const loc_specular = gl.getUniformLocation(h_prog, "uSpecular");
    const loc_spotlight = gl.getUniformLocation(h_prog, "uSpotLightPosition");
    const loc_spotlight_direction = gl.getUniformLocation(h_prog, "uSpotLightDirection");
    const loc_spotlight_cutoff = gl.getUniformLocation(h_prog, "uSpotLightCutoff");
    const loc_spotlight_enable = gl.getUniformLocation(h_prog,"uSpotEnable");
    const loc_pointlight_enable = gl.getUniformLocation(h_prog, "uPointEnable");
    const loc_spotlight_color = gl.getUniformLocation(h_prog, "uSpotLightColor");
    const loc_pointlight_color = gl.getUniformLocation(h_prog, "uPointLightColor");

    const spotLightPosition = calcSpotLightPos(7, 90.0, 70.0);
    const spotLightDirection = [0.0, 0.0, 0.0];
    const spotLightCutoff = 10.0;

    const {vao, length} = init_sphere(gl, loc_aPosition, loc_aTexCoord, loc_aNormal);

    const VP = mat4.create();
    // Projection transformation
    mat4.perspective(VP, toRadian(30), canvas.width/canvas.height, 1, 100);
    // View transformation
    mat4.translate(VP, VP, [0, 0, -20]);

    // Model transformation (might be different for each object to render)
    const M = mat4.create();
    mat4.translate(M, M, [1, 0, 0]);
    mat4.rotate(M, M, toRadian(180), [1, 0, 0]);
    mat4.rotate(M, M, toRadian(180), [0, 0, 1]);
    mat4.rotate(M, M, toRadian(30), [0, 1, 0]);

    // build the MVP matrix
    const MVP = mat4.create();
    mat4.multiply(MVP, VP, M);

    const programs = {
        h_prog: h_prog,
    };
    const vaos = {
        earthVAO: vao,
    };
    const uniforms={
        MVP:{location:loc_MVP, value: MVP},
        Model: {location:loc_M, value: M},
        uSampler: { location: loc_Sampler, value: 0 },
        uHeight:  { location: loc_height, value: 0 },
        uHeightScale: {location: loc_scale, value: 1.0},
        uSpecular: {location: loc_specular, value: 0},
        uSpot: {location: loc_spotlight, value: spotLightPosition},
        uSpotDir: {location: loc_spotlight_direction, value: spotLightDirection},
        uSpotCut: {location: loc_spotlight_cutoff, value: spotLightCutoff},
        uPointEnable: {location: loc_pointlight_enable, value: 1.0},
        uSpotEnable: {location: loc_spotlight_enable, value: 1.0},
        uSpotColor: {location: loc_spotlight_color, value: new Float32Array([4.0,4.0,4.0])},
        uPointColor: {location: loc_pointlight_color, value: new Float32Array([1.0,1.0,1.0])}
    };
    let latitude= 38.0;
    let longitude = 128.0;
    //init setting
    {
        //Rotation angle
        const angle = document.getElementById("angle").value;
        document.getElementById("angle-val").innerText = angle;
        const VP = mat4.create();
        // Projection transformation
        mat4.perspective(VP, toRadian(30), canvas.width/canvas.height, 1, 100);
        // View transformation
        mat4.translate(VP, VP, [0, 0, -20]);
        // Model transformation (might be different for each object to render)
        const M = mat4.create();
        mat4.translate(M, M, [1, 0, 0]);
        mat4.rotate(M, M, toRadian(180), [1, 0, 0]);
        mat4.rotate(M, M, toRadian(180), [0, 0, 1]);
        mat4.rotate(M, M, toRadian(angle), [0, 1, 0]);
        // build the MVP matrix
        const MVP = mat4.create();
        mat4.multiply(MVP, VP, M);
        uniforms.MVP.value = MVP;
        uniforms.Model.value = M;

        //height
        const height = document.getElementById("height").value;
        document.getElementById("height-val").innerText = height;
        uniforms.uHeightScale.value = parseFloat(height);

        //longitude
        const long = document.getElementById("longitude").value;
        document.getElementById("longitude-val").innerText = long;
        uniforms.uSpot.value = calcSpotLightPos(7, latitude, parseFloat(long));
        longitude = parseFloat(long);
        //latitude
        const lat = document.getElementById("latitude").value;
        document.getElementById("latitude-val").innerText = lat;
        uniforms.uSpot.value = calcSpotLightPos(7, parseFloat(lat), longitude);
        latitude = parseFloat(lat);
        //cutoff
        const cut = document.getElementById("cutoff-angle").value;
        document.getElementById("cutoff-angle-val").innerText = cut;
        uniforms.uSpotCut.value = parseFloat(cut);
    }
    loadTextures(gl)
        .then((textures)=>{
            render_scene({gl, canvas, programs, vaos , uniforms:uniforms, indexCount:length, textures});
            slider_callback("angle", () =>{
                const val = document.getElementById("angle").value;
                document.getElementById("angle-val").innerText = val;

                const VP = mat4.create();
                // Projection transformation
                mat4.perspective(VP, toRadian(30), canvas.width/canvas.height, 1, 100);
            
                // View transformation
                mat4.translate(VP, VP, [0, 0, -20]);
            
                // Model transformation (might be different for each object to render)
                const M = mat4.create();
                mat4.translate(M, M, [1, 0, 0]);
                mat4.rotate(M, M, toRadian(180), [1, 0, 0]);
                mat4.rotate(M, M, toRadian(180), [0, 0, 1]);
                mat4.rotate(M, M, toRadian(val), [0, 1, 0]);
            
                // build the MVP matrix
                const MVP = mat4.create();
                mat4.multiply(MVP, VP, M);
                
                uniforms.MVP.value = MVP;
                
                render_scene({gl, canvas, programs, vaos , uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("height", (e)=>{
                const val = document.getElementById("height").value;
                document.getElementById("height-val").innerText = val;
                
                uniforms.uHeightScale.value = parseFloat(val);
                render_scene({gl, canvas, programs, vaos , uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("longitude", () => {
                const val = document.getElementById("longitude").value;
                document.getElementById("longitude-val").innerText = val;
                uniforms.uSpot.value = calcSpotLightPos(7, latitude, parseFloat(val));
                longitude = parseFloat(val);
                render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("latitude", () => {
                const val = document.getElementById("latitude").value;
                document.getElementById("latitude-val").innerText = val;
                uniforms.uSpot.value = calcSpotLightPos(7, parseFloat(val), longitude);
                latitude = parseFloat(val);
                render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("cutoff-angle", ()=>{
                const val = document.getElementById("cutoff-angle").value;
                document.getElementById("cutoff-angle-val").innerText = val;
                uniforms.uSpotCut.value = parseFloat(val);
                render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("light-spot", ()=>{
                const val = document.getElementById("light-spot").checked ? 1.0: 0.0;
                uniforms.uSpotEnable.value = parseFloat(val);
                render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
            });
            slider_callback("light-point", ()=>{
                const val = document.getElementById("light-point").checked ? 1.0: 0.0;
                uniforms.uPointEnable.value = parseFloat(val);
                console.log(uniforms.uPointEnable.value)
                render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
            });
            addEventListener("keydown", (e)=>{
                const keyID = e.keyCode;
                let valLong = document.getElementById("longitude").value;
                let valLat = document.getElementById("latitude").value;
                const keyMessage = document.getElementById("message");
                switch (keyID) {
                    // left arrow key
                    case 37:
                        keyMessage.innerText = "Left arrow is pressed.";
                        if (valLong != 0) {
                            document.getElementById("longitude").value = valLong--;
                            document.getElementById("longitude-val").innerText = valLong;
                            uniforms.uSpot.value = calcSpotLightPos(7, latitude, parseFloat(valLong));
                            longitude = valLong;
                            render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
                            break;
                        }
                        break;
                    // right arrow key
                    case 39:
                        keyMessage.innerText = "Right arrow is pressed.";
                        if (valLong != 360) {
                            document.getElementById("longitude").value = valLong++;
                            document.getElementById("longitude-val").innerText = valLong;
                            uniforms.uSpot.value = calcSpotLightPos(7, latitude, parseFloat(valLong));
                            longitude = valLong;
                            render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
                            break;
                        }
                        break;
                    case 38:
                        keyMessage.innerText = "Up arrow is pressed.";
                        if(valLat != 90){
                            document.getElementById("latitude").value = valLat++;
                            document.getElementById("latitude-val").innerText = valLat;
                            uniforms.uSpot.value = calcSpotLightPos(7, parseFloat(valLat), longitude);
                            latitude = valLat;
                            render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
                            break;
                        }
                        break;
                    case 40:
                        keyMessage.innerText = "Down arrow is pressed.";
                        if (valLat != -90) {
                            document.getElementById("latitude").value = valLat--;
                            document.getElementById("latitude-val").innerText = valLat;
                            uniforms.uSpot.value = calcSpotLightPos(7, parseFloat(valLat), longitude);
                            latitude = valLat;
                            render_scene({gl, canvas, programs, vaos, uniforms:uniforms, indexCount:length, textures});
                            break;
                        }
                        break;   
                }
            });
            addEventListener("keyup", (e) => {
                const keyMessage = document.getElementById("message");
                keyMessage.innerText = "";
            });
        })
        .catch((error)=>{
            console.error(error);
        })
}



main();
