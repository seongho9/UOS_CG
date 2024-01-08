function createSphere(radius, latitudeBands, longitudeBands) {
    let vertices = [];
    let indices = [];
    let textureCoord = [];
    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        let theta = latNumber * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            let phi = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = cosPhi * sinTheta;
            let y = cosTheta;
            let z = sinPhi * sinTheta;
            
            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);

            textureCoord.push(longNumber/longitudeBands);
            textureCoord.push(latNumber/latitudeBands);
        }
    }

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
            let first = (latNumber * (longitudeBands + 1)) + longNumber;
            let second = first + longitudeBands + 1;

            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(first + 1);
            indices.push(second);
            indices.push(second + 1);
        }
    }

    const length = indices.length;
    return { vertices, indices, textureCoord, length};
}

export default function init_sphere(gl, loc_aPosition, loc_aTexCoord, loc_aNormal) {
    const { vertices, indices, textureCoord, length } = createSphere(4, 250, 250);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buf_pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf_pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aPosition);
    gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);

    const buf_tex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf_tex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aTexCoord);
    gl.vertexAttribPointer(loc_aTexCoord, 2, gl.FLOAT, false, 0, 0);
    

    const buf_normal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf_normal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc_aNormal);
    gl.vertexAttribPointer(loc_aNormal, 3, gl.FLOAT, false, 0, 0);
    

    const buf_index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf_index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    return { vao, length };
}