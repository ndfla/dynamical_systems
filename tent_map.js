import { Text } from "./text.js"
import { Element } from "./element.js"
import { createCanvas, resize } from "./canvas.js"
import { Slider } from "./slider.js"
import { DiscreteDynamicalSystem } from "./render.js"


document.getElementById("tent").onclick = () => {

    const page = document.getElementById("page")
    page.innerHTML = ""


    Element.create(page, "h1",{
        id: "heading",
        textContent: "a-y graph of logistic map"
    })

    const UIcontainer = Element.create(page, "section",{id: "UIcontainer"})

    const [canvas, canvasCtx] = createCanvas(UIcontainer)

    const render = new DiscreteDynamicalSystem({
        context: canvasCtx,
        initwidth: 12.0,

        sample: canvas.width,
        iteration: 100,
        threshold: 20,
        initx: 0.5,

        callback: (a,x) => {return a*Math.min(x, 1-x)},
    })

    render.param.pointerX = 0.0
    render.param.pointerY = 0.0

    const text = new Text(render, UIcontainer, {
        id: "text-container",
        className: "row row-cols-2 rounded"
    })

    const slider = new Slider(render, UIcontainer, {
        id: "slider-container",
        className: "row row-cols-2 rounded"
    })


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
        render.plot()

        slider.update("magnification")
        text.update()
    });


    canvas.addEventListener("pointerdown", (event) => {

        event.preventDefault()

        render.moveCenter(event.offsetX,  event.offsetY)

        render.plot()

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

        render.plot()
    })
    
    render.plot()
}
