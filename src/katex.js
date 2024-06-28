

const createKatexText = (content, page, size='Large', displayMode=1) => { 

    
    const text = content.replaceAll(" ", "&#")
    const title = katex.renderToString(
        '\\' + size + " \\allowbreak " + "" + text + "" , 
        {
        displayMode: displayMode,
        throwOnError: false,
    })

    page.innerHTML += title
}


const createKatexEquation = (content, page, size='Large', displayMode=1) => { 

    const equation = katex.renderToString(
        '\\' + size + '{' + content +'}', 
        {
        displayMode: displayMode,
        throwOnError: false
    })

    page.innerHTML += equation
}

export { createKatexText, createKatexEquation } 