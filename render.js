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

    point(x,y){

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

    line(x1,y1,x2,y2, color='gray'){

        this.canvas.context.strokeStyle = color

        this.canvas.context.beginPath()

        this.canvas.context.moveTo(
            this.coordToCanvasX(x1),
            this.coordToCanvasY(y1),
        )

        this.canvas.context.lineTo(
            this.coordToCanvasX(x2),
            this.coordToCanvasY(y2),
        )

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

    curvature(f,x,y,h){
        const fx = (x,y) => (f(x+h,y)-f(x-h,y))/(2*h)

        const fy = (x,y) => (f(x,y+h)-f(x,y-h))/(2*h)

        const fxx = (x,y) => (fx(x+h,y)-fx(x-h,y))/(2*h)

        const fyy = (x,y) => (fy(x,y+h)-fy(x,y-h))/(2*h)

        const fxy = (x,y) => (fx(x,y+h)-fx(x,y-h))/(2*h)


        const radius = (x,y) => Math.sqrt(fx(x,y)**2 + fy(x,y)**2)**3/(fxx(x,y)*fy(x,y)**2 - 2*fxy(x,y)*fx(x,y)*fy(x,y) + fyy(x,y)*fx(x,y)**2)
        return radius(x,y)
    }

    graphImplicit(callback, sample){

        callback = (x,y) => x**2 + y**2 - 1

        // callback = (x,y) => (x**2 + y**2)**2 - 2*1*(x**2 - y**2) 

        console.log(this.curvature(callback, 0,0, 0.01))

        for(let x=0; x<sample; x++){

            const _x = this.param.centerX + (x/sample-0.5)*this.camera.width

            const lx = this.param.centerX + ((x-0.5)/sample-0.5)*this.camera.width 

            const rx= this.param.centerX + ((x+0.5)/sample-0.5)*this.camera.width 
  
            for(let y=0; y<sample*this.canvas.aspect; y++){

                const _y = this.param.centerY + (0.5 - y/(sample*this.canvas.aspect))*this.camera.height

                const uy = this.param.centerY + (0.5 - (y+0.5)/(sample*this.canvas.aspect))*this.camera.height

                const dy = this.param.centerY + (0.5 - (y-0.5)/(sample*this.canvas.aspect))*this.camera.height

                const lu = Math.sign(callback(lx, uy))

                const ru = Math.sign(callback(rx, uy))

                const ld = Math.sign(callback(lx, dy))

                const rd = Math.sign(callback(rx, dy))

                if (!(lu==ru && ld==rd && lu==ld)) this.point(_x, _y)
            }
        }
    }

    xygraph(callback,sample){

        const d = this.camera.width/sample

        const offset = this.param.centerX-0.5*this.camera.width

        for(let i=0; i<sample; i++){

            const a = d*(i-0.5) + offset
            const b = a + d

            let x = a

            for (let k=0; k<this.canvas.height; k++){

                if (!(x>=a && x<b)) break

                const y = callback(x)
    
                if (isFinite(y) && !isNaN(y)) {
    
                    this.point(x,y)
    
                    let c = Math.abs((callback(x+d/100)-callback(x-d/100))/(2*d/100))
                    
    
                    if (isNaN(c)) {
                        x+=d/this.canvas.height
                        continue
                    }
    
                    if (c <= 1.0) x+=d/this.canvas.height
                    else x+=d/c  
                    
                }
                else x+=d/this.canvas.height
            }
        }
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
        this.param.sample = data.sample
        this.param.callback = data.callback

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

                y = this.param.callback(x,y)

                if (i>=this.param.iteration-this.param.threshold) this.draw.point(x,y)
            }
        }
    }
}


export { DiscreteDynamicalSystem }