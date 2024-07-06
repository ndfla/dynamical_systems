import { Element } from "./element.js"
import { isPropertyExist } from "./util.js"
class Slider {
    constructor(target,container, attribute){

        this.target = target

        this.sliderObj = {}

        this.container = Element.create(container, "div", attribute)

        this.getProperty = (path) => path.reduce((obj, property) => obj[property], target.param)

        this.setProperty = (path, value) => {

            let obj = target.param

            for (let i=0; i<path.length-1; i++) obj = obj[path[i]]
    
            obj[path[path.length-1]] = value

            return 
        }
            
        this.isPropertyExist = (path) => isPropertyExist(target.param, path)
    }

    static sliderToValue(value, max, min, step, digit){

        return Math.round(((max-min)*value/step + min)*10**digit)/10**digit
    }

    static valueToSlider(value, max, min, step, digit){
        
        return Math.round((step*(value-min)/(max-min))*10**digit)/10**digit
    }

    createSlider(){

        const container = Element.create(this.container, "div")

        const sliderInfo = Element.create(container, "h5", {className: "lead"})

        const sliderDOM = Element.create(container, "input", {
            type: "range", 
            id: "slider"
        })

        return [sliderDOM, sliderInfo]
    }

    initialize(data){

        const f = this.isPropertyExist(data.path)

        if (f==="undefined") return

        const valueToSlider = (value) => Slider.valueToSlider(value, data.max, data.min, data.step, 3)

        const sliderToValue = (value) => Slider.sliderToValue(value, data.max, data.min, data.step, 3)

        const [sliderDOM, sliderInfo] = this.createSlider()

        Element.update(sliderDOM,
            {
                min: 0,
                max: data.step,
                value: valueToSlider(f)
            }
        )

        sliderInfo.innerHTML =`${data.info} : <b> ${f} </b>`

        sliderDOM.addEventListener('input', (e) => {

            const absoluteScale = sliderToValue(e.target.value)

            this.setProperty(data.path, absoluteScale)

            sliderInfo.innerHTML = `${data.info} : <b> ${absoluteScale} </b>`
            
            this.target.plot()

        })

        this.sliderObj[data.path.join(".")] = {
            info: {
                DOM: sliderInfo,
                content: data.info
            },
            DOM: sliderDOM, 
            property: () => this.getProperty(data.path),

            setProperty: (value) => this.setProperty(data.path, sliderToValue(value)),

            setValue: () => {sliderDOM.value = valueToSlider(this.getProperty(data.path))},
        }
        return 
    }

    update(keys=Object.keys(this.sliderObj)){

        for(let key of keys){

            const obj = this.sliderObj[key]

            obj.setValue()

            obj.info.DOM.innerHTML = `${obj.info.content} : <b> ${obj.property()} </b>`
        }
    }

    add(key, n){
        const obj = this.sliderObj[key]

        obj.DOM.value = String(Number(obj.DOM.value) + n)


        obj.setProperty(obj.DOM.value)

        obj.info.DOM.innerHTML = `${obj.info.content} : <b> ${obj.property()} </b>`

    }
}


export { Slider };
