
class Element {

    static create(container, tag, attribute){

        const element = document.createElement(tag)

        if (typeof container != "undefined") container.appendChild(element)

        this.update(element, attribute)

        return element
    }

    static update(element, attribute){

        if (typeof attribute != "undefined"){
    
            for(let name of Object.keys(attribute)){
                element[name] = attribute[name]
            }
        }
    }

}

export { Element }