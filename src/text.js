import { Element } from "./element.js"
import { isPropertyExist } from "./util.js"

class Text {
    constructor(target, container, attribute){

        this.textObj = {}

        this.container = Element.create(container, "div", attribute)

        this.getProperty = (path) => path.reduce((obj, property) => obj[property], target.param)

        this.isPropertyExist = (path) => isPropertyExist(target.param, path)
    }

    createText(){

        const container = Element.create(this.container, "div")

        const textDOM = Element.create(container, "p")

        return textDOM
    }

    initializeText(data) {

        const f = this.isPropertyExist(data.path)

        if (f==="undefined") return

        const  textDOM = this.createText(data)

        textDOM.className = "lead"
        textDOM.innerHTML = `${data.info} : <b> ${f} </b>`

        this.textObj[data.path.join(".")] = {
            DOM:textDOM, 
            property: () => this.getProperty(data.path)
        }
    }

    update(keys=Object.keys(this.textObj)){

        for(let key of keys){

            const property = this.textObj[key].property()

            this.textObj[key].DOM.innerHTML = `${key} : <b> ${Math.round(property*10**5)/10**5} </b>`
        }
    }
}

export { Text };