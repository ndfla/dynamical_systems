import { Element } from "./element.js"

class Slider {
    constructor(target,container, attribute){

        this.target = target

        this.sliderData = {}

        this.container = Element.create(container, "div", attribute)
    }

    createSlider(){

        const container = Element.create(this.container, "div")

        const sliderInfo = Element.create(container, "h5", {className: "lead"})

        const slider = Element.create(container, "input", {type: "range"})

        return [slider, sliderInfo]
    }

    initialize(data){

        const [slider, sliderInfo] = this.createSlider()


        Element.update(slider,
            {
                id: "id" in data ? data.id : "slider",
                min: 0,
                max: data.step,
                value: data.step/(data.max-data.min) * (this.target.param[data.var]-data.min)
            }
        )

        sliderInfo.innerHTML = data.info + ": " +"<b>"+ String(this.target.param[data.var]) + "</b>"

        slider.addEventListener('input', (e) => {

            const absoluteScale = Math.round(((data.max-data.min)*e.target.value/data.step + data.min) *10**3)/10**3

            this.target.param[data.var] = absoluteScale

            sliderInfo.innerHTML = data.info + ": " + "<b>"+ String(absoluteScale) +"</b>"
            
            this.target.plot()

        })

        this.sliderData[data.var] = {
            object: slider, 
            info: sliderInfo,
            data: data
        }
        return 
    }

    update(variable){

        const slider = this.sliderData[variable].object

        const info = this.sliderData[variable].info

        const data = this.sliderData[variable].data


        slider.value = Math.round((data.step*(this.target.param[data.var]-data.min)/(data.max-data.min))*10**3)/10**3

        info.innerHTML = data.info + ": " + "<b>" +  String(this.target.param[variable]) + "</b>"
        
    }
}


export { Slider };
