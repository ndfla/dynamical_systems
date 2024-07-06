
import { Text } from "./text.js"
import { Element } from "./element.js"
import { resize } from "./canvas.js"
import { Slider } from "./slider.js"
import { DiscreteDynamicalSystem, VectorField, Cobweb, Lissajous, Lorentz, Mandelbrot } from "./render.js"
import { createKatexEquation} from "./katex.js"

const draw = {
    DDS: (data) => new DiscreteDynamicalSystem(data),
    VF: (data) => new VectorField(data),
    CW: (data) => new Cobweb(data),
    LC: (data) => new Lissajous(data),
    LS: (data) => new Lorentz(data),
    MB: (data) => new Mandelbrot(data)
}

const controller = new AbortController()

const loadPage = (json) => {

    controller.abort()

    const oldpage = document.getElementById("page")

    const page = oldpage.cloneNode(false)

    oldpage.parentNode.replaceChild(page,oldpage)


    const header = Element.create(page, "section",{id: "header",className:"text-wrap"})


    if ("title" in json ) {
        const title = Element.create(header, "h1",{className:"display-5"})
        title.innerHTML = json.title
    }

    if ("equation" in json) createKatexEquation(json.equation, header)


    if ("UIcontainer" in json && "canvas" in json.UIcontainer) {
    
        const UIcontainer = Element.create(page, "section",{id: "UIcontainer"})


        const canvasContainer = Element.create(UIcontainer, "div",{})


        const data = json.UIcontainer.canvas.data
        
        data.container = canvasContainer

        const render = draw[json.UIcontainer.canvas.type](data)

        const text = new Text(render, UIcontainer, {
            id: "text-container",
            className: "row row-cols-2 rounded"
        })
    
        const slider = new Slider(render, UIcontainer, {
            id: "slider-container",
            className: "row row-cols-2 rounded"
        })

        for (let sliderData in json.UIcontainer.slider){

            slider.initialize(json.UIcontainer.slider[sliderData])
        }

        for (let textData in json.UIcontainer.text){

            text.initializeText(json.UIcontainer.text[textData])
        }

        
        const setEvent = (canvas) => { 

            canvas.addEventListener("wheel", (event) => {

                event.preventDefault();
        
                if (event.deltaY<=-10){
        
                    render.coordinate.moveCenter(event.offsetX,  event.offsetY) 

                    slider.add("magnification", 1)
                }

                else if (event.deltaY>=10){
        
                    render.coordinate.moveCenter(event.offsetX,  event.offsetY)

                    slider.add("magnification", -1)
                }

                render.plot();
        
                slider.update(["magnification"])
                text.update()
            });
        
            canvas.addEventListener("pointerdown", (event) => {
        
                event.preventDefault()
        
                render.coordinate.moveCenter(event.offsetX,  event.offsetY)
        
                render.plot()
        
                text.update()
        
            });
        
            canvas.addEventListener("pointermove", (event) => {
        
                event.preventDefault()
        
                const [x,y] = render.coordinate.canvasPointToCoordinate(event.offsetX,  event.offsetY)

                render.param.pointer.x = x
                render.param.pointer.y = y

                text.update()
            });
        
            canvas.addEventListener("touchmove", (event) => { event.preventDefault() });


            window.addEventListener('resize',() => {

                render.canvas.DOM.map((v) => resize(v))
        
                render.canvas.width = render.canvas.DOM[0].width
                render.canvas.height = render.canvas.DOM[0].height
        
                render.plot()
            },{ signal: controller.signal })    
        }

        setEvent(render.canvas.DOM[render.canvas.number-1])

        render.plot()
    }  

    return 
}

export { loadPage }