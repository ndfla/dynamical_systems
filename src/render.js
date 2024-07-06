import {adams} from "./runge.js"
import { explicitGraph } from "./explicit_function.js"
import { createCanvas } from "./canvas.js"

class Canvas {
    constructor(container, color,num=1){

        const [canvas, canvasCtx] = createCanvas(container, num)

        this.layer = 0

        this.DOM = canvas
        this.context = canvasCtx

        this.width = canvas[0].width
        this.height = canvas[0].height
        
        this.aspect = this.height/this.width

        this.number = num

        canvas.map((c) => c.style.backgroundColor = "transparent")

        canvas[0].style.backgroundColor = typeof color!="undefined" ? color : "black" 

    }

    get target() {return this.context[this.layer]}
}


class Coordinate {

    #initwidth

    constructor(data){
        this.canvas = new Canvas(data.container, data.backgroundColor, data.canvasNum)

        this.#initwidth = typeof data.initwidth==="undefined" ? 4 : data.initwidth

        this.param = Object.assign(data, {
            magnification: typeof data.magnification==="undefined" ? 1 : data.magnification,

            center: typeof data.center==="undefined" ? {x: 0.0, y: 0.0} : data.center,
            scale: {x: 1.0, y:1.0},
            pointer: {x: 0.0, y: 0.0},

        })

        this.width = () => this.#initwidth/2**(this.param.magnification-1)

    }

    get viewWidth(){ return this.width()/this.param.scale.x }

    get viewHeight(){ return this.width()*this.canvas.aspect/this.param.scale.y }

    canvasPointToCoordinate(x,y){
        x = this.param.center.x + this.viewWidth*(x/this.canvas.width-0.5)
        y = this.param.center.y + this.viewHeight*(0.5-y/this.canvas.height)
        
        return [x,y]
    }

    coordinateToCanvasPoint(x,y){
        x = this.canvas.width*(0.5 + (x-this.param.center.x)/this.viewWidth)
        y = this.canvas.height*(0.5 - (y-this.param.center.y)/this.viewHeight)

        return [x,y]
    }

    moveCenter(x,y) {
        [this.param.center.x, this.param.center.y] = this.canvasPointToCoordinate(x, y)
    }
}

class Draw {
    constructor(coordinate){
        this.coordinate = coordinate
        this.canvas = coordinate.canvas
        this.param = coordinate.param

    }

    get targetCanvas() { return this.canvas.target}

    get pixelLengthX() { return this.coordinate.viewWidth/this.canvas.width}

    get pixelLengthY() { return this.coordinate.viewHeight/this.canvas.height}

    isPointInside(x,y) {
        const b1 = Math.abs(x-this.param.center.x)<=0.5*this.coordinate.viewWidth
        const b2 = Math.abs(y-this.param.center.y)<=0.5*this.coordinate.viewHeight

        return b1 && b2
    }

    clear(){

        this.targetCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    localPoint(x,y,r,color='red'){

        this.targetCanvas.fillStyle = color;
        
        [x,y] = this.coordinate.coordinateToCanvasPoint(x,y)

        this.targetCanvas.beginPath();
        this.targetCanvas.arc(x, y, r, 0, 2*Math.PI);
        this.targetCanvas.fill();
    }

    point(x,y, color='white'){


        const r = {
            x: this.coordinate.viewWidth/2,
            y: this.coordinate.viewHeight/2
        }

        if (Math.abs(x-this.param.center.x)>r.x || Math.abs(y-this.param.center.y)>r.y) return

        this.targetCanvas.fillStyle = color;
            
        [x,y] = this.coordinate.coordinateToCanvasPoint(x,y)

        this.targetCanvas.fillRect(x,y,1,1)
    }


    line(x1,y1,x2,y2, color='gray', width=1){


        const b1 = this.isPointInside(x1,y1)
        const b2 = this.isPointInside(x2,y2)

        const point = []


        if (!(b1 && b2)) {

            const c = {x: this.param.center.x, y: this.param.center.y}

            const r = {x: 0.5*this.coordinate.viewWidth, y: 0.5*this.coordinate.viewHeight}

            const left = c.x - r.x
            const top = c.y + r.y
            const right = c.x + r.x
            const bottom = c.y - r.y
            
            const verticalLine = (lineX) => {

                if (Math.sign(x1-lineX) != Math.sign(x2-lineX)) {

                    const t = (lineX-x1)/(x2-x1)
        
                    const intersectionY = y1 + t*(y2-y1) 
        
                    if (t==1 || Math.abs(intersectionY - c.y) <= r.y) point.push([lineX, intersectionY])
                }
            }

            const holizontalLine = (lineY) => {

                if (Math.sign(y1-lineY) != Math.sign(y2-lineY)) {

                    const t = (lineY-y1)/(y2-y1)

        
                    const intersectionX = x1 + t*(x2-x1) 
        
                    if (t==1 || Math.abs(intersectionX - c.x) <= r.x) point.push([intersectionX, lineY])
                }
            }

            verticalLine(left)
            verticalLine(right)
            holizontalLine(top)
            holizontalLine(bottom)

            if (point.length<2 && b1) point.push([x1,y1])
            if (point.length<2 && b2) point.push([x2,y2])
            
        }
        else {
            point.push([x1,y1])
            point.push([x2,y2])
        }


        if (point.length<2) return

        [x1,y1] = this.coordinate.coordinateToCanvasPoint(...point[0]);

        [x2,y2] = this.coordinate.coordinateToCanvasPoint(...point[1])


        this.targetCanvas.strokeStyle = color

        this.targetCanvas.lineWidth = width

        this.targetCanvas.beginPath()

        this.targetCanvas.moveTo(x1,y1)
        this.targetCanvas.lineTo(x2,y2)

        this.targetCanvas.stroke()


    }

    rect(x,y, width, height){


        this.targetCanvas.fillStyle = 'black'

        [x1,y1] = this.coordinate.coordinateToCanvasPoint(x,y)

        const [x2,y2] = this.coordinate.coordinateToCanvasPoint(x+width,y+height)

        width = x2-x1
        height = y1-y2

        this.targetCanvas.fillRect(
            Math.max(x1, 0.0), 
            Math.max(y1, 0.0), 
            Math.min(width+Math.min(x1, 0.0), this.canvas.width), 
            Math.min(height+Math.min(y1, 0.0), this.canvas.height)
        )
    }

    grid(){
        const width = this.coordinate.viewWidth
        const height = this.coordinate.viewHeight

        const k = width<50 ? 1.0 : 5*10**(Math.floor(Math.log10(width/5.0)-1.0))

        const l = this.param.center.x - 0.5*width

        const u = this.param.center.y - 0.5*height

        let s = Math.floor(l) - Math.floor(l)%k

        let t = Math.floor(u) - Math.floor(u)%k

        while(s<=l+width){

            if (s==0){
                this.line(s, u, s, u+height,"darkred")

            }
            else this.line(s, u, s, u+height)

            s+=k
        }

        while(t<=u+height){

            if (t==0){ 
                this.line(l, t, l+width, t,"darkred")
            }
            else this.line(l, t, l+width, t)

            t+=k
        }
    }

    eachPoint(f){

        let image = this.targetCanvas.createImageData(this.canvas.width, this.canvas.height)

        const pixelwidth = this.pixelLengthX
        const pixelheight = this.pixelLengthY 

        let x = this.param.center.x - 0.5*this.coordinate.viewWidth
        let y
        
        for(let i=0; i<this.canvas.width; i++){

            y = this.param.center.y + 0.5*this.coordinate.viewHeight

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

        this.targetCanvas.putImageData(image,0,0)


    }

    implicit(f){

        const pixlenX = this.pixelLengthX
        const pixlenY = this.pixelLengthY

        let _x = this.param.center.x - 0.5*this.camera.width

        for(let x=0; x<this.canvas.width; x++){

            const lx = _x - 0.5*pixlenX
            const rx = _x + 0.5*pixlenX

            let _y = this.param.center.y + 0.5*this.camera.height

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

        const _x = this.param.center.x - 0.5*this.coordinate.viewWidth
        
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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas

        this.param = Object.assign(this.coordinate.param,{

            iteration: data.iteration,
            threshold: data.threshold,
            initx: data.initx,

            sample: 'sample' in data ? data.sample : this.canvas.width,

            domain: data.domain
        })

        this.map = data.map
    }

    normalizeSample(a){
        return this.param.center.x + (a/this.param.sample-0.5)*this.coordinate.viewWidth
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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas

        this.param = Object.assign(this.coordinate.param,{
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

        this.param.center.x = this.param.initx 
        this.param.center.y = this.param.inity

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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas

        this.param = Object.assign(this.coordinate.param,{

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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas


        this.param = Object.assign(this.coordinate.param,{

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
            this.draw.canvas.layer=1
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

        this.draw.canvas.layer = 0

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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas

        this.param = Object.assign(this.coordinate.param,{
            initx: data.initx,
            inity: data.inity,
            initz: data.initz,

            sigma: data.sigma,
            rho: data.rho,
            beta: data.beta,

            sample: data.sample,

            h: data.h,

            rotation: data.rotation,
        })

        this.fx = (x,y,z) => this.param.sigma*(y-x)
        this.fy = (x,y,z) => x*(this.param.rho-z)-y
        this.fz = (x,y,z) => x*y-this.param.beta*z

        this.rotz = (x,y,z) => {

            const c = Math.cos(this.param.rotation)
            const s = Math.sin(this.param.rotation)
            
            const x_ = c*x+s*y
            const y_ = -s*x+c*y

            return [x_,y_,z]
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

        this.coordinate = new Coordinate(data)

        this.draw = new Draw(this.coordinate)

        this.canvas = this.coordinate.canvas

        this.param = Object.assign(this.coordinate.param,{

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