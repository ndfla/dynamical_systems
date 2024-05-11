import { Text, createText } from "./text.js"
import { createCanvas, resize } from "./drawCanvas.js"
import { Slider } from "./slider.js"
import { DiscreteDynamicalSystem } from "./render.js"

const addElement = function(target, tag, id){

    const element = document.createElement(tag)
    element.id = id
    target.appendChild(element)

    return element
}


const page = document.getElementById("page")
page.innerHTML = ""


createText(page, "h1", "a-y graph of logistic map", "heading")

const UIcontainer = addElement(page, "section", "UIcontainer")

const [canvas, canvasCtx] = createCanvas(UIcontainer)

const render = new DiscreteDynamicalSystem({
    context: canvasCtx,

    initwidth: 12.0,

    sample: canvas.width,
    iteration: 100,
    threshold: 20,
    initx: 0.5,

    callback: (a,x) => {return a*x*(1-x)}

    // callback: (a,x) => {return (Math.sin(x)+a*Math.cos(a*x))*a}

    // callback: (a,x) => {return (x**3-a/x)*(1 -(x**3-a/x)) }

    // callback: (a,x) => {return x<0.5 ? a*x : a*(1-x)}
})

render.param.pointerX = 0.0
render.param.pointerY = 0.0

render.dynamics()


const slider = new Slider(render)
const text = new Text(render)


slider.initialize(
    {
        id: "slider",
        info: "magnification",
        var: "magnification",
        min: -5,
        max: 40,
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
        step:400,
    }
)

slider.initialize( 
    {
        id: "slider",
        info: "sample",
        var: "sample",
        min: canvas.width/2,
        max: canvas.width*2,
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
        step:99,
    }
)

slider.initialize(
    {
        id: "slider",
        info: "threshold",
        var: "threshold",
        min: 1,
        max: 200,
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
        step:45,

    }
)

text.createText({ info: "centerX" })

text.createText({ info: "pointerX",})

text.createText({ info: "centerY" })

text.createText({ info: "pointerY" })


text.container.className = "row row-cols-2 rounded"

UIcontainer.appendChild(text.container)

slider.container.className = "row row-cols-2 rounded"

UIcontainer.appendChild(slider.container)



canvas.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (event.deltaY<=-100){

        render.moveCenter(event.offsetX,  event.offsetY)
        render.param.magnification+=1
          
    }
    else if (event.deltaY>=100){

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

    render.param.pointerX = Math.round(x*10**5)/10**5

    render.param.pointerY = Math.round(y*10**5)/10**5

    text.update()


});

canvas.addEventListener("touchmove", (event) => { event.preventDefault() });

window.addEventListener('resize',() => {

    resize(canvas)

    render.canvas.width = canvas.width
    render.canvas.height = canvas.height

    render.dynamics()
})
 
