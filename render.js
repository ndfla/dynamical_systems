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

    constructor(data){

        this.canvas = new Canvas(data.context, data.backgroundColor)

        this.initwidth = data.initwidth

        this.param = {
            magnification: data.magnification,
            centerX: data.center.x,
            centerY: data.center.y,

            scaleX: data.scale.x,
            scaleY: data.scale.y,

            coordX: 0,
            coordY: 0
        }

    }

    get width(){ return (this.initwidth/2**(this.param.magnification-1))}

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
        this.space = new Coordinate(data)

        this.param = this.space.param

        this.canvas = this.space.canvas

        

    } 

    get width(){ return this.space.scaledWidth}

    get height(){ return this.space.scaledHeight}

    getCoordFromCanvas(x,y){
        return this.space.getCoordFromCanvas(x,y)
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

    point(x,y){

        this.canvas.context.fillStyle = 'white'
            
        x = this.canvas.width*(0.5 + (x-this.param.centerX)/this.camera.width)
        
        y = this.canvas.height*(0.5 + (this.param.centerY-y)/this.camera.height)

        this.canvas.context.fillRect(x,y,1,1)

    }

    line(x1,y1,x2,y2, color='gray'){

        this.canvas.context.strokeStyle = color

        
        this.canvas.context.beginPath()

        this.canvas.context.moveTo(
            this.canvas.width*(0.5 + (x1-this.param.centerX)/this.camera.width),
            this.canvas.height*(0.5 + (this.param.centerY-y1)/this.camera.height)
        )

        this.canvas.context.lineTo(
            this.canvas.width*(0.5 + (x2-this.param.centerX)/this.camera.width),
            this.canvas.height*(0.5 + (this.param.centerY-y2)/this.camera.height)

        )

        

        this.canvas.context.stroke()

    }

    rect(x,y, width, height){

        this.canvas.context.fillStyle = 'black';
        

        const initialPoint = {
            x: x - (this.param.centerX-0.5*this.camera.width),
            y: y - (this.param.centerY-0.5*this.camera.height)
        }
        
        const canvasInitPoint = {
            x: initialPoint.x * this.pixelLengthX,
            y: this.canvas.height - initialPoint.y * this.pixelLengthY
        }
        
        if (canvasInitPoint.x>this.canvas.width || canvasInitPoint.y>this.canvas.height) return
        
        const rectWidth = width*this.pixelLengthX
        
        const rectHeight = height*this.pixelLengthY
        
        const X = canvasInitPoint.x < 0 ? [0, canvasInitPoint.x + rectWidth] : [canvasInitPoint.x, rectWidth]
        
        const Y = canvasInitPoint.y < 0 ? [0, canvasInitPoint.y + rectHeight] : [canvasInitPoint.y, rectHeight]
        
        this.canvas.context.fillRect(X[0], Y[0], Math.min(X[1],this.canvas.width), Math.min(Y[1],this.canvas.height))
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

        this.grid()

        

        callback = (x,y) => x**2 + y**2 - 1

        // callback = (x,y) => (x**2 + y**2)**2 - 2*1*(x**2 - y**2) 

        

        console.log(this.curvature(callback, 0,0, 0.01))

        // callback = (x,y) => (Math.floor(x)-y)




        // console.log(this.camera.width, this.param.centerX, this.param.centerY)

        // this.quad(0,this.param.centerX, this.param.centerY, this.camera.width, 11)

        
        // callback = (x,y) => Math.cos(x)* Math.sin(y) + ((x**2 + y**2)**2 - 2*1*(x**2 - y**2))

        // callback = (x,y) => (x**2 + y**2)**2 - 2*1*(x**2 - y**2)

        // callback = (x,y) => (Math.cos(x+y) + Math.sin(x+y))/Math.abs((x-2)**2 + (y-1)**2)-0.5


        // callback = (x,y) => (x**2 +(y-4)**3)


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
}


class DynamicalSystem {
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
     
    point(x,y){
        this.draw.point(x,y)
    }

    rect(x,y,w,h){
        this.draw.rect(x,y,w,h)
    }

    dynamics(){

        

        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.draw.grid()

        
        for(let a=0; a<this.param.sample; a++){
            let y = this.param.initx

            const x = this.normalizeSample(a)

            // if (x<=-2.0) continue

            // if (x>=4.0) break

            for(let i=0; i<this.param.iteration; i++){

                y = this.param.callback(x,y)

                if (i>this.param.iteration-this.param.threshold) this.point(x,y)

            }
        }

        // for(let a=0; a<this.param.sample; a++){
        //     for(let b=0; b<this.param.sample; b++){

        //         let x = 0.1
        //         let y = 0

        //         const A = this.widthScaledSample(a)

        //         const B = this.heightScaledSample(b)

        //         // if (x<=-2.0) continue

        //         // if (x>=4.0) break

        //         for(let i=0; i<this.param.iteration; i++){

        //             // y = this.param.callback(A, B, x, y)

        //             const _x = x 
        //             const _y = y

        //             y = B*_x

        //             x = 1 - A*_x**2 + _y

        //             if (i>this.param.iteration-this.param.threshold) this.draw(x,y)

        //         }
        //     }
        // }

    }
}


// const render = {

//     sample: initSample,
//     n: initIteration,
//     m: initThreshold,
//     area: initArea,
//     position: [3.0, 2/3],
//     width: initWidth,
//     aspect:3/4,


//     scaleX: 1.0,
//     scaleY: 1.0,

//     x: initX,

//     scaledSample(a){
//         return this.position[0]+(a/this.sample-0.5)*this.scaledWidth
//     },

//     get height(){ return this.aspect*this.width},

//     get scaledWidth(){return this.width/this.scaleX},

//     get scaledHeight(){return this.width*this.aspect/this.scaleY},

//     draw(x,y){

//         canvasCtx.fillStyle = 'white'
        
//         x = x/this.sample*canvas.width
        
//         y = canvas.height*(0.5 + (this.position[1]-y)/this.scaledHeight)


//         canvasCtx.fillRect(x,y,1,1)
//     },

//     setDrawingArea(){

//         canvasCtx.fillStyle = 'black';

//         const pixelLength = [canvas.width/this.scaledWidth, canvas.height/this.scaledHeight]

//         const initialPoint = {
//             x: this.area[0] - (this.position[0]-0.5*this.scaledWidth),
//             y: this.area[1] - (this.position[1]-0.5*this.scaledHeight)
//         }

//         const canvasInitPoint = {
//             x: initialPoint.x * pixelLength[0],
//             y: canvas.height - initialPoint.y * pixelLength[1]
//         }

//         if (canvasInitPoint.x>canvas.width || canvasInitPoint.y>canvas.height) return

//         const rectWidth = this.area[2]*pixelLength[0]

//         const rectHeight = this.area[3]*pixelLength[1]

//         const X = canvasInitPoint.x < 0 ? [0, canvasInitPoint.x + rectWidth] : [canvasInitPoint.x, rectWidth]

//         const Y = canvasInitPoint.y < 0 ? [0, canvasInitPoint.y + rectHeight] : [canvasInitPoint.y, rectHeight]

//         canvasCtx.fillRect(X[0], Y[0], X[1], Y[1])
//     },

//     getCoordFromCanvas(x,y){

//         x = this.position[0] + this.scaledWidth*(x/canvas.width-0.5)

//         y = this.position[1] + this.scaledHeight*(0.5-y/canvas.height)

//         return [x, y]
    
//     },

//     movePositon(x,y){
//         this.position = this.getCoordFromCanvas(x, y)

//         return this.position
//     }
// }

export {DynamicalSystem}