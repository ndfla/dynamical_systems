
class Slider {
    constructor(target){

        this.target = target

        this.sliderData = {}

        this.container = document.createElement("div")
        this.container.id = "slider-container"
    }

    createSlider(){
        const slider = document.createElement("input")
        slider.type = "range"

        const sliderInfo = document.createElement("h5")

        sliderInfo.className = "lead"

        const container = document.createElement("div")

        container.appendChild(sliderInfo)
        container.appendChild(slider)

        this.container.appendChild(container)

        return [slider, sliderInfo]

    }

    initialize(data){

        const [slider, sliderInfo] = this.createSlider()


        slider.id = data.id
        
        slider.min = 0
        slider.max = data.step
        slider.value = data.step/(data.max-data.min) * (data.value-data.min)

        sliderInfo.innerHTML = data.info + ": " +"<b>"+ String(data.value) + "</b>"

        
        // sliderInfo.appendChild()


        slider.addEventListener('input', (e) => {

            const absoluteScale = Math.round(((data.max-data.min)*e.target.value/data.step + data.min) *10**3)/10**3

            this.target.param[data.var] = absoluteScale

            sliderInfo.innerHTML = data.info + ": " + "<b>"+ String(absoluteScale) +"</b>"
            
            this.target.dynamics()

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
