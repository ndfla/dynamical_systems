import { Text, createText } from "./text.js"
import { createCanvas, resize } from "./drawCanvas.js"
import { Slider } from "./slider.js"
import { DynamicalSystem } from "./render.js"





const page = document.getElementById("page")
page.innerHTML = ""

createText(page, "h1", "a-y graph of logistic map", "heading")

const UIcontainer = document.createElement("section")

UIcontainer.id = "UIcontainer"

page.appendChild(UIcontainer)





const [canvas, canvasCtx] = createCanvas(UIcontainer)


const initX = 0.5

const initSample = canvas.width

const initIteration = 100

const initThreshold = 20

const initWidth = 12



const render = new DynamicalSystem({
    context: canvasCtx,
    center: {x:0, y:0},
    initwidth: initWidth,
    magnification: 1,
    scale:{x:1.0 ,y:1.0},

    sample: initSample,
    iteration: initIteration,
    threshold: initThreshold,
    initx: initX,

    callback: (a,x) => {return a*x*(1-x)}

    // callback: (a,x) => {return Math.sin(x)+a*Math.cos(a*x)}

    // callback: (a,x) => {return (x**3-a/x)*(1 -(x**3-a/x)) }


    // callback: (a,x) => {return x<0.5 ? a*x : a*(1-x)}
})


render.dynamics()


const slider = new Slider(render)


slider.initialize(
    {
        id: "slider",
        info: "magnification",
        var: "magnification",
        min: -5,
        max: 40,
        value: 1,
        step:45,
    }
)

slider.initialize(
    {
        id: "slider",
        info: "initial x",
        var: "initx",
        min: -2,
        max: 2,
        value: 0.5,
        step:400,

    }
)

slider.initialize( 
    {
        id: "slider",
        info: "sample",
        var: "sample",
        min: initSample/2,
        max: initSample*2,
        value: 600,
        step:3,
    }
)

slider.initialize(
    {
        id: "slider",
        info: "iteration",
        var: "iteration",
        min: 10,
        max: 1000,
        value: initIteration,
        step:990/10,
    }
)

slider.initialize(
    {
        id: "slider",
        info: "threshold",
        var: "threshold",
        min: 1,
        max: 200,
        value: initThreshold,
        step:199,

    }
)

slider.initialize(
    {
        id: "slider",
        info: "scaleY",
        var: "scaleY",
        min: 0.5,
        max: 5.0,
        value: 1.0,
        step:45,

    }
)

const text = new Text(render)

text.createText({
    info: "centerX",

    id: ""
})

text.createText({
    info: "coordX",
    id: ""
})


text.createText({
    info: "centerY",
    id: ""
})


text.createText({
    info: "coordY",
    id: ""
})

text.container.className = "row row-cols-2 rounded"

UIcontainer.appendChild(text.container)

slider.container.className = "row row-cols-2 rounded"

UIcontainer.appendChild(slider.container)



canvas.addEventListener("wheel", (event) => {

    event.preventDefault();

    let zoom = event.deltaY 

    if (zoom<=-100){

        render.moveCenter(event.offsetX,  event.offsetY)
        render.param.magnification+=1
          
    }
    else if (zoom>=100){

        render.moveCenter(event.offsetX,  event.offsetY)
        render.param.magnification-=1
    }

    render.dynamics()

    slider.update("magnification")
    text.update()
});


canvas.addEventListener("pointerdown", (event) => {

    event.preventDefault()

    render.moveCenter(event.offsetX,  event.offsetY)

    render.dynamics()

    text.update()


});

canvas.addEventListener("pointermove", (event) => {

    event.preventDefault()

    const [x,y] = render.getCoordFromCanvas(event.offsetX,  event.offsetY)

    render.param.coordX = Math.round(x*10**5)/10**5

    render.param.coordY = Math.round(y*10**5)/10**5

    text.update()


});

window.addEventListener('resize',() => {

    resize(canvas)

    render.draw.canvas.width = canvas.width
    render.draw.canvas.height = canvas.height

    render.dynamics()
})
 
