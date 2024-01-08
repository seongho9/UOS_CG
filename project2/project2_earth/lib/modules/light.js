import * as mat4 from "../gl-matrix/mat4";
import * as vec3 from "../gl-matrix/vec3";
import * as vec4 from "../gl-matrix/vec4";
import { init_shaders } from "./shader";

export class Light{

    constructor(gl, position, ambient, diffuse, specular, enabled){
        this.position = vec4.clone(position);
        this.ambient = vec3.clone(ambient);
		this.diffuse = vec3.clone(diffuse);
		this.specular = vec3.clone(specular);
        this.enabled = enabled;

        this.M = mat4.create();
        this.MVP = mat4.create();
    }
}