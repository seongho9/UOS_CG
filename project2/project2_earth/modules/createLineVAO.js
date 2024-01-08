import { loc_aColor, loc_aPosition } from "./shader";

export function createLineVAO(gl, positionInfo, colorInfo) {

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    //pos
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionInfo, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aPosition);
    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);

    //color
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorInfo, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aColor);
    gl.vertexAttribPointer(loc_aColoron, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    return vao;
}