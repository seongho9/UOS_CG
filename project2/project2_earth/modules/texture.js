function loadTexture(gl, path, number)
{
    return new Promise((resolve, reject)=>{
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + number);
        if(!texture){
            console.log("Failed to create texture object");
            return false;
        }
        const image = new Image(256, 256);
        image.src = path;
    
        image.onload = () => {
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);

            resolve(texture);
        };
    
        image.onerror = () => {
            reject(`Failed to load texture from ${path}`);
        }
    });
}

export default function loadTextures(gl)
{
    let textures=[];
    const texture1 = loadTexture(gl, './earthmap1k.jpg', 0);
    const texture2 = loadTexture(gl, './earthbump1k.jpg', 1);
    const texture3 = loadTexture(gl, './earthspec1k.jpg', 2);

    return new Promise((resolve, reject)=>{
        Promise.all([texture1, texture2, texture3])
            .then(res=>{
                res.forEach(texture=>{
                    textures.push(texture)
                });
                resolve(textures);
            })
            .catch(err=>{
                console.error(err);
                reject(err);
            });
        });
}