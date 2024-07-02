import {adams} from "./runge.js"
import { explicitGraph } from "./explicit_function.js"
import { createCanvas } from "./canvas.js"

class Canvas {
    constructor(container, color,num=1){

        const [canvas, canvasCtx] = createCanvas(container, num)

        this.DOM = canvas
        this.context = canvasCtx

        this.width = canvas[0].width
        this.height = canvas[0].height
        
        this.aspect = this.height/this.width

        this.number = num

        canvas.map((c) => c.style.backgroundColor = "transparent")

        canvas[0].style.backgroundColor = typeof color!="undefined" ? color : "black" 

    }
}


class Coordinate {

    #initwidth

    constructor(data){
        this.canvas = new Canvas(data.container, data.backgroundColor, data.canvasNum)

        this.#initwidth = data.initwidth

        this.param = {
            magnification: typeof data.magnification=="undefined" ? 1 : data.magnification,
            centerX: typeof data.center=="undefined" ? 0.0 : data.center.x,
            centerY: typeof data.center=="undefined" ? 0.0 : data.center.y,

            scaleX: typeof data.scale=="undefined" ? 1.0 : data.scale.x,
            scaleY: typeof data.scale=="undefined" ? 1.0 : data.scale.y,
        }
    }

    get width(){ return (this.#initwidth/2**(this.param.magnification-1))}

    get scaledWidth(){return this.width/this.param.scaleX }

    get scaledHeight(){ return this.width*this.canvas.aspect/this.param.scaleY }

    getCoordFromCanvas(x,y){
    
        x = this.param.centerX + this.scaledWidth*(x/this.canvas.width-0.5), 

        y = this.param.centerY + this.scaledHeight*(0.5-y/this.canvas.height)
        
        return [x,y]
    }
}
class Camera {
    constructor(data){  
        this.coord = new Coordinate(data)

        this.param = this.coord.param

        this.canvas = this.coord.canvas
    } 

    get width(){ return this.coord.scaledWidth}

    get height(){ return this.coord.scaledHeight}

    moveCenter(x,y) {
        [this.param.centerX, this.param.centerY] = this.coord.getCoordFromCanvas(x, y)
    }

    coordToCanvasX(x){
        return this.canvas.width*(0.5 + (x-this.param.centerX)/this.width)
    }

    coordToCanvasY(y){
        return this.canvas.height*(0.5 - (y-this.param.centerY)/this.height)
    }

}

class Draw {
    constructor(camera){
        this.camera = camera
        this.canvas = camera.canvas
        this.param = camera.param

        this.layer = 0
    }

    get pixelLengthX() { return this.camera.width/this.canvas.width}

    get pixelLengthY() { return this.camera.height/this.canvas.height}

    get target() {return this.canvas.context[this.layer]}

    coordToCanvasX(x){
        return this.canvas.width*(0.5 + (x-this.param.centerX)/this.camera.width)
    }

    coordToCanvasY(y){
        return this.canvas.height*(0.5 - (y-this.param.centerY)/this.camera.height)
    }

    clear(){

        this.target.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    localPoint(x,y,r,color='red'){

        this.target.fillStyle = color
        
        x = this.coordToCanvasX(x)
        y = this.coordToCanvasY(y)

        this.target.beginPath();
        this.target.arc(x, y, r, 0, 2*Math.PI);
        this.target.fill();
    }

    point(x,y, color='white'){


        const r = {
            x: this.camera.width/2,
            y: this.camera.height/2
        }

        if (x>this.param.centerX+r.x || x<this.param.centerX-r.x ||
            y>this.param.centerY+r.y || y<this.param.centerY-r.y
        ) return

        this.target.fillStyle = color
            
        x = this.coordToCanvasX(x)
        
        y = this.coordToCanvasY(y)

        this.target.fillRect(x,y,1,1)
    }


    line(x1,y1,x2,y2, color='gray', width=1){


        x1 = this.coordToCanvasX(x1)
        y1 = this.coordToCanvasY(y1)
        x2 = this.coordToCanvasX(x2)
        y2 = this.coordToCanvasY(y2)

        // 線の位置がずれる

        y1 = Math.abs(y1) > 2*this.canvas.height ? Math.sign(y1)*2*this.canvas.height : y1
        y2 = Math.abs(y2) > 2*this.canvas.height ? Math.sign(y2)*2*this.canvas.height : y2

        this.target.strokeStyle = color

        this.target.lineWidth = width

        this.target.beginPath()

        this.target.moveTo(x1,y1)
        this.target.lineTo(x2,y2)

        this.target.stroke()

    }

    rect(x,y, width, height){

        this.canvas.context[this.layer].fillStyle = 'black';

        const x1 = this.coordToCanvasX(x)
        const y1 = this.coordToCanvasY(y)


        width = this.coordToCanvasX(x+width)-x1
        height = y1-this.coordToCanvasY(y+height)

        this.target.fillRect(
            Math.max(x1, 0.0), 
            Math.max(y1, 0.0), 
            Math.min(width+Math.min(x1, 0.0), this.canvas.width), 
            Math.min(height+Math.min(y1, 0.0), this.canvas.height)
        )
    }

    diff(callback,h){
        return (a) => (callback(a+h)-callback(a-h))/(2*h)

    }

    grid(){

        const k = this.camera.width<50 ? 1.0 : 5*10**(Math.floor(Math.log10(this.camera.width/5.0)-1.0))

        const l = this.param.centerX - this.camera.width/2

        const u = this.param.centerY - this.camera.height/2

        let s = Math.floor(l) - Math.floor(l)%k

        let t = Math.floor(u) - Math.floor(u)%k

        while(s<=l+this.camera.width){

            if (s==0){
                this.line(s, u, s, u+this.camera.height,"darkred")

            }
            else this.line(s, u, s, u+this.camera.height)

            s+=k
        }

        while(t<=u+this.camera.height){

            if (t==0){
                this.line(l, t, l+this.camera.width, t,"darkred")
            }
            else this.line(l, t, l+this.camera.width, t)

            t+=k
        }
    }

    eachPoint(f){

        const context = this.target

        let image = context.createImageData(this.canvas.width, this.canvas.height)

        const pixelwidth = this.pixelLengthX
        const pixelheight = this.pixelLengthY 

        let x = this.param.centerX - 0.5*this.camera.width
        let y
        
        for(let i=0; i<this.canvas.width; i++){

            y = this.param.centerY + 0.5*this.camera.height

            for(let j=0; j<this.canvas.height; j++){

                const n = 4*(i+j*this.canvas.width)

                const color = f(x, y)

                y-=pixelheight

                if (!color) continue

                image.data[n] = color[0]
                image.data[n+1] = color[1]
                image.data[n+2] = color[2]
                image.data[n+3] = color[3]


            }  
            x+=pixelwidth
        }

        context.putImageData(image,0,0)


    }

    implicit(f){

        const pixlenX = this.pixelLengthX
        const pixlenY = this.pixelLengthY

        let _x = this.param.centerX - 0.5*this.camera.width

        for(let x=0; x<this.canvas.width; x++){

            const lx = _x - 0.5*pixlenX
            const rx = _x + 0.5*pixlenX

            let _y = this.param.centerY + 0.5*this.camera.height

            for(let y=0; y<this.canvas.height; y++){

                const uy = _y - 0.5*pixlenY
                const dy = _y + 0.5*pixlenY

                const lu = Math.sign(f(lx, uy))
                const ru = Math.sign(f(rx, uy))
                const ld = Math.sign(f(lx, dy))
                const rd = Math.sign(f(rx, dy))

                if (!(lu==ru && ld==rd && lu==ld)) this.point(_x, _y)

                _y -= pixlenY
            }

            _x += pixlenX
        }
    }

    explicit(f){

        const lineWidth = 3
        const color = "ghostwhite"

        const h = this.pixelLengthX

        const _x = this.param.centerX - 0.5*this.camera.width
        
        const data = explicitGraph(f, h, _x, this.canvas.width)

        for (let i=0; i<data.length-1; i++){

            if (data[i+1]=="discontinuity") continue

            else if (data[i]=="discontinuity") continue

            else this.line(...data[i], ...data[i+1], color, lineWidth)
        }

        if (data[data.length-2]=="discontinuity") return
        
        else this.line(...data[data.length-2] , ...data[data.length-1], color,lineWidth)
    }
}

class DiscreteDynamicalSystem {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = Object.assign(this.camera.param,{

            iteration: data.iteration,
            threshold: data.threshold,
            initx: data.initx,

            sample: 'sample' in data ? data.sample : this.canvas.width,

            domain: data.domain
        })

        this.map = data.map
        
    }

    normalizeSample(a){
        return this.param.centerX + (a/this.param.sample-0.5)*this.camera.width
    }

    plot(){

        this.draw.clear()
        this.draw.grid()
        
        for(let a=0; a<this.param.sample; a++){
            let y = this.param.initx

            const x = this.normalizeSample(a)

            if (typeof this.param.domain!="undefined" && !this.param.domain(x)) continue


            for(let i=0; i<this.param.iteration; i++){

                y = this.map(x,y)

                if (i>=this.param.iteration-this.param.threshold) this.draw.point(x,y)
            }
        }
    }
}

class VectorField {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = Object.assign(this.camera.param,{
            initx: data.initx,
            inity: data.inity,
            sample: data.sample,

            fx: data.fx,
            fy: data.fy,
            h: data.h,

            domain: data.domain,
        })

    }

    plot(){

        this.param.centerX = this.param.initx 
        this.param.centerY = this.param.inity

        this.draw.clear()
        this.draw.grid()

        // this.draw.vectorField(this.param.fx,this.param.fy)
        
        let points = adams( 
            [this.param.initx, this.param.inity],
            [this.param.fx, this.param.fy],
            this.param.h,
            this.param.sample
        )

        for(let i=0;i<points.length-1;i++) this.draw.line(...points[i], ...points[i+1], 'white',2)

        this.draw.localPoint(this.param.initx, this.param.inity,3)

    }
}

class Cobweb {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = Object.assign(this.camera.param,{

            iteration: data.iteration,
            a: data.a,
            x: data.x,
            sample: data.sample,
            transparency: data.transparency
        })

        this.map = data.map
    }

    plot(){

        this.draw.clear()
        this.draw.grid()

        const f = (x) => this.map(this.param.a, x)

        this.draw.explicit(x=>x)
        this.draw.explicit(x=>f(x))

        this.draw.localPoint(this.param.x,0,3)

        let x = this.param.x
        let y = 0

        for (let i=0; i<this.param.iteration; i++){

            const y_ = f(x)
            this.draw.line(x, y, x, y_, `rgba(255,127,80, ${ this.param.transparency })`, 2)

            this.draw.line(x, y_,y_,y_, `rgba(255,127,80, ${ this.param.transparency })`, 2)

            x = y_
            y = y_
        }
        
    }
}

class Lissajous {
    constructor(data){

        data.canvasNum = 2

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas


        this.param = Object.assign(this.camera.param,{

            sample: data.sample,
            A: data.A,
            a: data.a,
            B: data.B,
            b: data.b,
            delta: data.delta,
        })

        this.x = data.x
        this.y = data.y

        this.period = () => {

            const a = this.param.a
            const b = this.param.b

            if (a==0 && b==0) return 0

            else if (a==0 || b==0) return a==0 ? 2*Math.PI/b : 2*Math.PI/a

            return 2*Math.PI * this.lcm_r(Math.round(10*Math.abs(a)), Math.round(10*Math.abs(b)))/(10*a*b)
        }


        this.fx = (t) => this.x(this.param.A, this.param.a, this.param.delta, t)

        this.fy = (t) => this.y(this.param.B, this.param.b, t)

        const startTime = Date.now();

        this.time = () => (Date.now() - startTime) / 1000

        this.p = () => {
            this.draw.layer=1
            this.draw.clear()
            const t = this.period()*((this.time()/10)%1.0)

            this.draw.localPoint(this.fx(t),this.fy(t),5)
        }

        setInterval(() => this.p(),1000/60)
        
    }

    lcm_r(a, b){
        const remainder = a % b
        if (remainder == 0) return a

        return a * this.lcm_r(b, remainder) / remainder
    }

    plot(){

        this.draw.layer = 0

        this.draw.clear()

        this.draw.grid()

        const p = this.period()

        for (let i=0; i<this.param.sample; i++){

            const  t = p/this.param.sample*i
            const  t_1 = t + p/this.param.sample

            this.draw.line(this.fx(t), this.fy(t), this.fx(t_1), this.fy(t_1), "white", 2)
        }

        this.p()


    }
}

class Lorentz {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = Object.assign(this.camera.param,{
            initx: data.initx,
            inity: data.inity,
            initz: data.initz,

            sigma: data.sigma,
            rho: data.rho,
            beta: data.beta,

            sample: data.sample,

            h: data.h,

            domain: data.domain,

            theta: data.theta,
            phi: data.phi,
        })

        this.fx = (x,y,z) => this.param.sigma*(y-x)
        this.fy = (x,y,z) => x*(this.param.rho-z)-y
        this.fz = (x,y,z) => x*y-this.param.beta*z


        this.rotz = (x,y,z) => {

            const c = Math.cos(this.param.phi)
            const s = Math.sin(this.param.phi)
            
            const x_ = c*x+s*y
            const y_ = -s*x+c*y

            return [x_,y_,z]
        }
 
        this.rotfront = (x,y,z, n) => {

            const c = Math.cos(this.param.theta)
            const s = Math.sin(this.param.theta)
 
            const x_ = (n[0]**2 * (1-c)+c)*x + n[0]*n[1]*(1-c)*y + n[1]*s*z
            const y_ = n[0]*n[1]*(1-c)*x + (n[1]**2 * (1-c)+c)*y - n[0]*s*z
            const z_ = -n[1]*s*x + n[0]*s*y + c*z

            return [x_,y_,z_]
        }
    }

    plot(){

        this.draw.clear()

        let points = adams( 
            [this.param.initx, this.param.inity, this.param.initz],
            [this.fx, this.fy, this.fz],
            this.param.h,
            this.param.sample,
            1
        )

        points = points.map((p) => this.rotz(...p))

        // this.param.centerX = points[points.length-1][1]
        // this.param.centerY = points[points.length-1][2]

        for(let i=0;i<points.length-1;i++) {

            const x = (points[i][0]+points[i+1][0])/2

            const c = x>25.5 ? 255 : x<-25.5 ? 128 : Math.floor(10*(x+25.5)/4)+128

            this.draw.line(points[i][1],points[i][2] ,points[i+1][1],points[i+1][2], `
                rgb(${c},${c},${c})`,2)
        }

        this.draw.localPoint(points[0][1], points[0][2],3)


    }
}


class Mandelbrot {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = Object.assign(this.camera.param,{

            iteration: data.iteration,
            contouring: data.contouring,

            julia: data.julia,
            juliaRe: data.juliaRe,
            juliaIm: data.juliaIm,
        })
    }

    plot(){

        const dd = this.draw.pixelLengthX

        this.draw.clear()

        this.draw.eachPoint((x,y)=>{

            const c = this.param.julia ? [this.param.juliaRe, this.param.juliaIm] : [x,y]

            let diff = [1,0]

            for(let i=0; i<this.param.iteration; i++){

                const x_ = x*x - y*y +c[0]
                const y_ = 2*x*y + c[1]

                const d0_ = 2*(x*diff[0] - y*diff[1]) + !this.param.julia
                const d1_ = 2*(x*diff[1] + y*diff[0])

                x = x_
                y = y_

                diff = [d0_, d1_]

                if (Math.abs(x)>10 || Math.abs(y)>10) {

                    const r = Math.sqrt(x**2+y**2)
                    const dr = Math.sqrt(d0_**2+d1_**2)

                    const de = 0.5*Math.log(r)*r/dr

                    const dist = Math.max(255-Math.floor(Math.floor(this.param.contouring*de/dd)),0)

                    return [dist,dist,dist,255]
                }
            }

            return false

        })

    }
}


export { DiscreteDynamicalSystem, VectorField, Cobweb, Lissajous, Lorentz, Mandelbrot }