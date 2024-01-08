
export default function init_axes(gl, loc_aPosition, loc_aColor) {

    const vertices = new Float32Array([
        // x-axis
        0.0, 0.0, 0.0,
        10.0, 0.0, 0.0,
        // y-axis
        0.0, 0.0, 0.0,
        0.0, 10.0, 0.0,
        // z-axis
        0.0, 0.0, 0.0,
        0.0, 0.0, 10.0
    ]);
    const axesColor = new Uint8Array([
        // x (red)
        255, 0, 0,
        255, 0, 0,
        // y (green)
        0, 255, 0,
        0, 255, 0,
        // z (blue)
        0, 0, 255,
        0, 0, 255,
    ]);

    const vao = gl.createVertexArray();

    // ===== position buffer =====
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, loc_aPosition, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aPosition);
    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);
    

    // ===== color buffer =====
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, loc_aColor, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aColor);
    gl.vertexAttribPointer(loc_aColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    
    
    return { vao };
}
