const resize = function(canvas) {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

const createCanvas = function(container, num=1 ){

  if (num==1) {
    const canvas = document.createElement("canvas")

    canvas.style.position = "relative"

    container.appendChild(canvas)
    resize(canvas)

    return [[canvas], [canvas.getContext("2d")]]

  }

  const canvas = []
  const canvasCtx = []
  
  for (let i=0; i<num; i++){
    const c = document.createElement("canvas") 

    canvas.push(c)
    canvasCtx.push(c.getContext("2d"))

    container.appendChild(c)
    resize(c)

    c.style.zIndex = i+1

    if(i>=1) c.style.position = "relative"
  }

  return [canvas, canvasCtx]
}


export { resize, createCanvas };