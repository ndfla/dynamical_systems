import {rungeKutta, adams} from "./runge.js"
import { explicitGraph } from "./explicit_function.js"

class Canvas {
    constructor(context, color){
        this.context = context

        this.width = context.canvas.width
        this.height = context.canvas.height
        
        this.aspect = this.height/this.width

        context.canvas.style.backgroundColor = typeof color!="undefined" ? color : "black" 
    }
}


class Coordinate {

    #initwidth

    constructor(data){
        this.canvas = new Canvas(data.context, data.backgroundColor)

        this.#initwidth = data.initwidth

        this.param = {
            magnification: typeof data.magnification=="undefined" ? 1.0 : data.magnification,
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

    getCoordFromCanvas(x,y){
        return this.coord.getCoordFromCanvas(x,y)
    }

    moveCenter(x,y) {
        [this.param.centerX, this.param.centerY] = this.getCoordFromCanvas(x, y)
    }
}

class Draw {
    constructor(camera){
        this.camera = camera
        this.canvas = camera.canvas
        this.param = camera.param
    }

    get pixelLengthX() { return this.canvas.width/this.camera.width}

    get pixelLengthY() { return this.canvas.height/this.camera.height}

    coordToCanvasX(x){
        return this.canvas.width*(0.5 + (x-this.param.centerX)/this.camera.width)
    }

    coordToCanvasY(y){
        return this.canvas.height*(0.5 - (y-this.param.centerY)/this.camera.height)
    }

    localPoint(x,y,r,color='red'){

        this.canvas.context.fillStyle = color
        
        x = this.coordToCanvasX(x)
        y = this.coordToCanvasY(y)

        this.canvas.context.beginPath();
        this.canvas.context.arc(x, y, r, 0, 2*Math.PI);
        this.canvas.context.fill();
    }

    point(x,y, color='white'){

        const r = {
            x: this.camera.width/2,
            y: this.camera.height/2
        }

        if (x>this.param.centerX+r.x || x<this.param.centerX-r.x ||
            y>this.param.centerY+r.y || y<this.param.centerY-r.y
        ) return

        this.canvas.context.fillStyle = 'white'
            
        x = this.coordToCanvasX(x)
        
        y = this.coordToCanvasY(y)

        this.canvas.context.fillRect(x,y,1,1)
    }

    line(x1,y1,x2,y2, color='gray', width=1){

        x1 = this.coordToCanvasX(x1)
        y1 = this.coordToCanvasY(y1)
        x2 = this.coordToCanvasX(x2)
        y2 = this.coordToCanvasY(y2)

        y1 = Math.abs(y1) > 2*this.canvas.height ? Math.sign(y1)*2*this.canvas.height : y1
        y2 = Math.abs(y2) > 2*this.canvas.height ? Math.sign(y2)*2*this.canvas.height : y2

        this.canvas.context.strokeStyle = color

        this.canvas.context.lineWidth = width

        this.canvas.context.beginPath()

        this.canvas.context.moveTo(x1,y1)
        this.canvas.context.lineTo(x2,y2)

        this.canvas.context.stroke()

    }

    rect(x,y, width, height){

        this.canvas.context.fillStyle = 'black';

        const x1 = this.coordToCanvasX(x)
        const y1 = this.coordToCanvasY(y)


        width = this.coordToCanvasX(x+width)-x1
        height = y1-this.coordToCanvasY(y+height)

        this.canvas.context.fillRect(
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

    id(){

        const callback = (x,y) => x-y

        const pixlenX = 1/this.pixelLengthX
        
        const pixlenY = 1/this.pixelLengthY

        let _x = this.param.centerX - 0.5*this.camera.width

        console.log(pixlenX, pixlenY, _x)

        for(let x=0; x<this.canvas.width; x++){


            const lx = _x - 0.5*pixlenX
            const rx = _x + 0.5*pixlenX

            let _y = this.param.centerY + 0.5*this.camera.height

            for(let y=0; y<this.canvas.height; y++){

                const uy = _y - 0.5*pixlenY
                const dy = _y + 0.5*pixlenY

                const lu = Math.sign(callback(lx, uy))
                const ru = Math.sign(callback(rx, uy))
                const ld = Math.sign(callback(lx, dy))
                const rd = Math.sign(callback(rx, dy))

                if (!(lu==ru && ld==rd && lu==ld)) this.point(_x, _y)

                _y -= pixlenY
            }

            _x += pixlenX
        }
    }

    explicit(callback){

        const lineWidth = 3
        const color = "ghostwhite"

        const h = 1/this.pixelLengthX

        const _x = this.param.centerX - 0.5*this.camera.width
        
        const data = explicitGraph(callback, h, _x, this.canvas.width)

        for (let i=0; i<data.length-1; i++){

            if (data[i+1]=="discontinuity") continue

            else if (data[i]=="discontinuity") continue

            else this.line(data[i][0], data[i][1], data[i+1][0], data[i+1][1], color, lineWidth)
        }

        if (data[data.length-2]=="discontinuity") return
        
        else this.line(data[data.length-2][0], data[data.length-2][1], data[data.length-1][0], data[data.length-1][1], color,lineWidth)
    }
}


class DiscreteDynamicalSystem {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = this.camera.param

        this.param.iteration = data.iteration
        this.param.threshold = data.threshold
        this.param.initx = data.initx

        this.param.sample = 'sample' in data ? data.sample : this.canvas.width
        this.map = data.map

        this.param.domain = data.domain

        
    }

    get width(){ return this.camera.width}

    get height(){ return this.camera.height}

    normalizeSample(a){
        return this.param.centerX + (a/this.param.sample-0.5)*this.width
    }

    getCoordFromCanvas(x,y){
        return this.camera.getCoordFromCanvas(x,y)
    }

    moveCenter(x,y) {
        this.camera.moveCenter(x,y)
    }

    plot(){

        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

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

        this.param = this.camera.param

        this.param.initx = data.initx
        this.param.inity = data.inity
        this.param.length = data.length
        this.param.sample = data.sample

        this.param.fx = data.fx
        this.param.fy = data.fy
        this.param.h = data.h

        this.param.domain = data.domain

    }

    get width(){ return this.camera.width}

    get height(){ return this.camera.height}

    normalizeSample(a){
        return this.param.centerX + (a/this.param.sample-0.5)*this.width
    }

    getCoordFromCanvas(x,y){
        return this.camera.getCoordFromCanvas(x,y)
    }

    moveCenter(x,y) {
        this.camera.moveCenter(x,y)
    }

    plot(){

        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.draw.grid()

        // this.draw.vectorField(this.param.fx,this.param.fy)
        
        let points = adams(
            this.param.initx,
            this.param.inity,
            this.param.fx, 
            this.param.fy,
            0,
            this.param.h,
            this.param.sample
        )

        for(let i=0;i<points.length-1;i++) this.draw.line(points[i][0],points[i][1],points[i+1][0],points[i+1][1], 'white')

        this.draw.localPoint(this.param.initx, this.param.inity,3)

    }
}

class Cobweb {
    constructor(data){

        this.camera = new Camera(data)

        this.draw = new Draw(this.camera)

        this.canvas = this.camera.canvas

        this.param = this.camera.param

        this.param.iteration = data.iteration

        this.param.a = data.a
        this.param.x = data.x

        this.param.sample = data.sample
        this.map = data.map

        this.param.transparency = data.transparency

        
    }

    get width(){ return this.camera.width}

    get height(){ return this.camera.height}

    normalizeSample(a){
        return this.param.centerX + (a/this.param.sample-0.5)*this.width
    }

    getCoordFromCanvas(x,y){
        return this.camera.getCoordFromCanvas(x,y)
    }

    moveCenter(x,y) {
        this.camera.moveCenter(x,y)
    }

    plot(){

        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
        
        // this.draw.explicit(x=>-Math.tan(x))

        // this.draw.explicit(x=>1/x - Math.floor(1/x))
        // this.draw.explicit(x=>Math.sin(1/x) )
    }
}


export { DiscreteDynamicalSystem, VectorField,Cobweb }