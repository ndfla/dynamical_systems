class Text {
    constructor(target){

        this.target = target

        this.data = {}

        this.container = document.createElement("div")
        this.container.id = "text-container"
    }

    createText(data){

        const container = document.createElement("div")

        const text = document.createElement("p")

        text.className = "lead"
        text.innerHTML = data.info + " : " + "<b>"+ String(this.target.param[data.info]) + "</b>"
        text.id = data.id

        container.appendChild(text)

        this.data[data.info] = text

        this.container.appendChild(container)
    }

    update(){

        for(let key of Object.keys(this.data)){
            this.data[key].innerHTML = key + " : " + "<b>"+ String(Math.round(this.target.param[key]*10**5)/10**5) + "</b>"
        }
    }
}


const createText = function(container, tag, content, id){

    const text = document.createElement(tag)
    text.textContent = content
    text.id = id
  
    container.appendChild(text)
  
    return text
  
  }



  export { Text,createText };