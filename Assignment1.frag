#ifdef GL_ES
precision mediump float;
#endif

int randDecider = 0;
    
float multiplier = 0.0;

float plot(vec2 st) {    
    return smoothstep(0.1 * time, 0.1, abs(st.y - st.x));
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(0.1*0.5),_radius+(_radius*0.01), dot(dist,dist)*4.0);
}

vec2 conveyor(vec2 _st, float _zoom, float _speed){
    _st *= _zoom;
    float u_time = time*_speed;
    if( fract(u_time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(u_time)*2.0;
        } else {
            _st.x -= fract(u_time)*2.0;
        }
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(u_time)*2.0;
        } else {
            _st.y -= fract(u_time)*2.0;
        }
    }
    return fract(_st);
}

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(1,78)))* 43758.);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

float hipixel (vec2 st, float mult) {
    return fract(sin(dot(st.xy, vec2(1,100))) * mult);
}

void main () {
        
    vec2 st = gl_FragCoord.xy/resolution;
    
    float y = st.y;
    
    vec2 translate = vec2(cos(time),cos(time));
    
    //st += translate*0.35;
    
    st = conveyor(st,9.,0.2);

    vec3 color = vec3(y);
    
    vec3 circles = vec3(circle(st, 0.1));
    
    float pct = plot(st);
    
    //color.r = pattern(st, vec2(1.0, 0.0), 0.3);
    //color.g = pattern(st + translate * 0.2, vec2(0.0, 0.5), 0.9);
    color.b = pattern(st + translate * 0.1, vec2(0.5, 0.2), 0.7);
    
    if(sin(time) < 0.9){
        color = color+pct*vec3(abs(sin(0.5 *time)), 0.2, abs(cos(0.2 * time)));
    
        circles = circles*vec3(0.6, 0.5, 0.0);
    
        color = color + circles;
    } else{
        if(randDecider == 6){
            multiplier = time;
            randDecider = 0;
        } else {
            multiplier += 10.;
        }
        color = vec3(hipixel(st, multiplier));
        
        randDecider++;
    }
    
    gl_FragColor = vec4(color, 1.0);
}