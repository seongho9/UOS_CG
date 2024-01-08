import { loc_aPosition, loc_aColor } from "./shader.js";

function setPos(radius, seg){
    
    const vertices = [];

    for (let i = 0; i < seg; i++) {
        const angle = i * Math.PI * 2 / seg;
        vertices.push(Math.cos(angle) * radius, 0.0, Math.sin(angle) * radius);
    }

    return vertices;
}
function setColor(seg, color){
    const colorarray = [];

    if(color.length !== 3){
        console.error("color is not length 3");

        return null;
    }
    for(let i=0; i<seg; i++){
        color.push(color[0]);
        color.push(color[1]);
        color.push(color[2]);
    }
    return colorarray;
}
export function init_equator(gl){

    const vert = setPos(6, 20);
    const color = setColor(20, [255,255,255]);
    const vao = createLineVAO(gl, vert, color);

    return vao;
}

export function init_meridian(gl){
    const vert = setPos(6, 20);
    const color = setColor(20, [0,255,255]);

    const vao = createLineVAO(gl, vert, color);

    return vao;
}

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
    gl.vertexAttribPointer(loc_aColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    return vao;
}