import { Element } from "./element.js"
class Text {
    constructor(target, container, attribute){

        this.target = target
        this.data = {}

        this.container = Element.create(container, "div", attribute)
    }

    createText(data){

        const container = Element.create(this.container, "div")

        const text = Element.create(container, "p", {id: data.id})

        text.className = "lead"
        text.innerHTML = data.info + " : " + "<b>"+ String(this.target.param[data.info]) + "</b>"

        this.data[data.info] = text
    }

    update(){

        for(let key of Object.keys(this.data)){
            this.data[key].innerHTML = key + " : " + "<b>"+ String(Math.round(this.target.param[key]*10**5)/10**5) + "</b>"
        }
    }
}

export { Text };