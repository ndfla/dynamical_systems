
const r4 = (xn,yn,f,tn,h) => {

    // let k1 = h*f(tn,xn,yn) 

    // let k2 = h*f(tn+h/2, xn+k1/2, yn+k1/2)

    // let k3 = h*f(tn+h/2, xn+k2/2, yn+k2/2)

    // let k4 = h*f(tn+h, xn+k3, yn+k3)

    let k1 = h*f(xn,yn) 

    let k2 = h*f(xn+k1/2, yn+k1/2)

    let k3 = h*f(xn+k2/2, yn+k2/2)

    let k4 = h*f(xn+k3, yn+k3)

    return (k1 + 2*k2 + 2*k3 + k4)/6

}
const rungeKutta = function(fx, fy, h, length, init = [0,0]){

    let tn = 0
    let xn = init[0]
    let yn = init[1]

    const forward = [[xn,yn]]
    const backward = []

    while(tn<length){

        tn += h
        xn += r4(xn,yn,fx,tn,h)
        yn += r4(xn,yn,fy,tn,h)

        forward.push([xn,yn])
    }

    h = -h
    tn = 0
    xn = init[0]
    yn = init[1]

    while(tn>-length){

        tn += h
        xn += r4(xn,yn,fx,tn,h)
        yn += r4(xn,yn,fy,tn,h)

        backward.push([xn,yn])
    }

    return (backward.reverse()).concat(forward)
}


const dot = (v1, v2) => (v1.map((value,i) => value*v2(i))).reduce(
    (sum, element) => sum+element, 0)


const initPoints = (x,y,fx,fy,t,h,step) => {

    const init = [x,y]

    const forward = []
    const backward = []

    const n = step >> 1

    const split = 200

    // forward orbit

    for(let i=0; i<n*split; i++){
        const x_ = x + r4(x,y,fx,t,h/split)
        const y_ = y + r4(x,y,fy,t,h/split);

        [x,y] = [x_, y_]

        if (i%split==split-1) forward.push([x,y])
    }

    x = init[0]
    y = init[1]

    // backward orbit

    for(let i=0; i<n*split; i++){
        const x_ = x + r4(x,y,fx,t,-h/split)
        const y_ = y + r4(x,y,fy,t,-h/split);

        [x,y] = [x_, y_]

        if (i%split==split-1) backward.push([x,y])
    }

    backward.reverse().push(init)

    return backward.concat(forward)
}

const beta8 = [-36799/120960, 295767/120960, -1041723/120960, 2102243/120960, -2664477/120960, 2183877/120960, -1152169/120960, 434241/120960].reverse()

const beta6 = [-475/1440, 2877/1440, -7298/1440, 9982/1440, -7923/1440, 4277/1440].reverse()



const adamsBashforth = ([x,y], [fx,fy], data, t, h, sample) => {

    const orbit = []

    for(let i=0; i<sample; i++){

        const x_ = x + h*dot(beta6, (k) => data[k][0])
        const y_ = y + h*dot(beta6, (k) => data[k][1])

        t += h;

        [x,y] = [x_, y_];

        orbit.push([x,y])

        data.unshift([fx(x,y), fy(x,y)])
        data.pop()
    }

    return orbit
}


const adams = (x,y,fx,fy,t,h,sample) => {

    const step = 6

    const points = initPoints(x,y,fx,fy,t,h,step)

    t = (points.length >> 1)*h

    const forwardOrbit = adamsBashforth( 
        points[points.length-1], 
        [fx, fy], 
        points.slice(-step, points.length).reverse().map((v,i) => [fx(v[0],v[1]), fy(v[0],v[1])]),
        t,
        h,
        sample
    )

    const backwardOrbit = adamsBashforth(
        points[0], 
        [fx, fy], 
        points.slice(0,step).map((v,i) => [fx(v[0],v[1]), fy(v[0],v[1])]),
        -t,
        -h,
        sample
    )

    backwardOrbit.reverse()
    
    return backwardOrbit.concat(points.concat(forwardOrbit))
}


// let [x,y,t,h] = [10,0,0,0.01]

// adams(x,y,(t,x,y)=>-y, (t,x,y)=>x, 0.1, t)


// while(t<20){

//     [x,y,t] = od(x,y,t,h,100)
// }



export { rungeKutta, adams }