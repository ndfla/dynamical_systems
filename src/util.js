const isPropertyExist = (obj, path) => {

    for(let i=0; i<path.length-1; i++){

        if (typeof obj!="object" || typeof obj[path[i]]==="undefined") return "undefined"

        obj = obj[path[i]]
    }

    const property = obj[path[ path.length-1 ]]

    return typeof property==="undefined" ? "undefined" : property
} 

export {isPropertyExist}