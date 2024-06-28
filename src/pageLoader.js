
import { Text } from "./text.js"
import { Element } from "./element.js"
import { createCanvas, resize } from "./canvas.js"
import { Slider } from "./slider.js"
import { DiscreteDynamicalSystem, VectorField, Cobweb } from "./render.js"
import { createKatexEquation, createKatexText } from "./katex.js"

const draw = {
    DDS: (data) => new DiscreteDynamicalSystem(data),
    VF: (data) => new VectorField(data),
    CW: (data) => new Cobweb(data)
}

const loadPage = (json) => {

    const page = document.getElementById("page")
    page.innerHTML = ""

    const header = Element.create(page, "section",{id: "header",className:"text-wrap"})


    if ("title" in json ) {
        const title = Element.create(header, "h1",{className:"display-5"})
        title.innerHTML = json.title
    }

    if ("equation" in json) createKatexEquation(json.equation, header)


    if ("UIcontainer" in json && "canvas" in json.UIcontainer) {
    
        const UIcontainer = Element.create(page, "section",{id: "UIcontainer"})

        const [canvas, canvasCtx] = createCanvas(UIcontainer)

        const data = json.UIcontainer.canvas.data
        data.context = canvasCtx

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

            json.UIcontainer.slider[sliderData]["var"] = sliderData
            slider.initialize(json.UIcontainer.slider[sliderData])
        }

        for (let textData of json.UIcontainer.text){

            if (render.param[textData] === undefined) render.param[textData]=0.0
            text.createText({ info: textData })
        }


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

            render.plot();
    
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
}

export { loadPage }