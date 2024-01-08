import {toRadian} from "../lib/gl-matrix/common.js";
import * as mat4 from "../lib/gl-matrix/mat4.js";
export default function render_scene(params) {
    const {gl, canvas, programs, vaos, uniforms, indexCount, textures } = params; // indexCount 추가
    
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 깊이 버퍼도 클리어 필요
    gl.enable(gl.DEPTH_TEST); // 깊이 테스트 활성화

    //load program
    gl.useProgram(programs.h_prog);
    //earth
    gl.uniformMatrix4fv(uniforms.MVP.location, false, uniforms.MVP.value);
    
    gl.uniform1f(uniforms.uSpotEnable.location, uniforms.uSpotEnable.value);
    gl.uniform1f(uniforms.uPointEnable.location, uniforms.uPointEnable.value);
    gl.uniform1f(uniforms.uHeightScale.location, uniforms.uHeightScale.value);

    gl.uniform3fv(uniforms.uSpot.location, uniforms.uSpot.value);
    gl.uniform3fv(uniforms.uSpotDir.location, uniforms.uSpotDir.value);
    
    gl.uniform3fv(uniforms.uSpotColor.location, uniforms.uSpotColor.value);
    gl.uniform3fv(uniforms.uPointColor.location, uniforms.uPointColor.value);

    gl.uniform1f(uniforms.uSpotCut.location, toRadian(parseFloat(uniforms.uSpotCut.value))); 

    gl.bindVertexArray(vaos.earthVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.uniform1i(uniforms.uSampler.location, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.uniform1i(uniforms.uHeight.location, 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    gl.uniform1i(uniforms.uSpecular.location, 2);

    
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    
    gl.bindVertexArray(null);

}