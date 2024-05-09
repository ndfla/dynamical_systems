const resize = function(canvas) {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

const createCanvas = function(container){

  const canvas = document.createElement("canvas")
  // canvas.className = "center-block"
  

  container.appendChild(canvas)

  resize(canvas)

  return [canvas, canvas.getContext("2d")]

}


export { resize, createCanvas };