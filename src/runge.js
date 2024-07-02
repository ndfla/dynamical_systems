
const r4 = (variables, f, h) => {

    const k1 = h*f(...variables) 

    const k2 = h*f(...(variables.map((v) => v + k1/2)))

    const k3 = h*f(...(variables.map((v) => v + k2/2)))

    const k4 = h*f(...(variables.map((v) => v + k3)))

    return (k1 + 2*k2 + 2*k3 + k4)/6
}

const dot = (v1, v2) => (v1.map((value,i) => value*v2(i))).reduce(
    (sum, element) => sum+element, 0)


const initPoints = (variables, equations, h, step) => {

    const init = variables

    const forward = []
    const backward = []

    const n = step >> 1

    const split = 200

    // forward orbit

    for(let i=0; i<n*split; i++){


        const v_ = variables.map((v,i) => v + r4(variables, equations[i], h/split)) 

        variables = v_

        if (i%split==split-1) forward.push(variables)
    }


    variables = init

    // backward orbit

    for(let i=0; i<n*split; i++){

        const v_ = variables.map((v,i) => v + r4(variables, equations[i], -h/split)) 
        
        variables = v_

        if (i%split==split-1) backward.push(variables)
    }

    backward.reverse().push(init)

    return backward.concat(forward)
}

const beta8 = [-36799/120960, 295767/120960, -1041723/120960, 2102243/120960, -2664477/120960, 2183877/120960, -1152169/120960, 434241/120960].reverse()

const beta6 = [-475/1440, 2877/1440, -7298/1440, 9982/1440, -7923/1440, 4277/1440].reverse()



const adamsBashforth = (variables, equations, data, h, sample) => {

    const orbit = []

    for(let i=0; i<sample; i++){

        const v_ = variables.map((v,i) => v + h*dot(beta6, (k) => data[k][i]))

        variables = v_

        orbit.push(variables)

        data.unshift(equations.map((f) => f(...variables)))
        data.pop()
    }

    return orbit
}

const adams = (variables, equations, h,sample, forward=0) => {

    const step = 6

    const points = initPoints(variables, equations, h, step)

    // console.log(points)


    // console.log(points.slice(-(step >> 1)-1,points.length))
    // t = (points.length >> 1)*h

    const forwardOrbit = adamsBashforth( 
        points[points.length-1],
        equations, 
        points.slice(-step,points.length).reverse().map((v,i) => equations.map((f) => f(...v)) ),
        h,
        sample
    )

    if (forward==1){
        return points.slice(-(step >> 1)-1,points.length).concat(forwardOrbit)
    }

    const backwardOrbit = adamsBashforth(
        points[0],
        equations, 
        points.slice(0,step).map((v,i) => equations.map((f) => f(...v)) ),
        -h,
        sample
    )

    // points.reverse()
    backwardOrbit.reverse()


    // console.log(points.concat(forwardOrbit))
    
    return backwardOrbit.concat(points.concat(forwardOrbit))
}


// let [x,y,t,h] = [1,0,0,0.01]

// const d =adams([x,y], [(x,y)=>-y, (x,y)=>x], 0.01,500)

// console.log(d.map((v) => v[0]**2 + v[1]**2))

// const fx = (x,y,z) => 10*(y-x)
// const fy = (x,y,z) => x*(28-z)-y
// const fz = (x,y,z) => x*y-(8/3)*z


// const d =adams([1,1,1], [fx, fy, fz], 0.01,10)

// const d = adams([1,0,1], [(x,y,z)=> 1, (x,y,z)=>z, (x,y,z)=>-y], 0.01,400,1)


// // const d = adams([1], [(x) => x], 0.1,50)

// console.log(d)
// console.log(d.map((v)=> v[2]**2+v[1]**2))



// while(t<20){

//     [x,y,t] = od(x,y,t,h,100)
// }


export { adams }