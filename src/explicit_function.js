
const getAngle = (y,x) => (Math.atan2(y, x)) * 180 / Math.PI

const valueIsInside = (a, b, value) => (a < value && value < b)

const detectDiscontinuity = (a,b,h,ang, f,n) => {

    const inita = a
    const initb = b

    const sign = Math.sign(ang)

    for (let k=0; k<n;k++){

        let c = 0.5*(a+b)

        const angle1 = getAngle(f(b)-f(c), h/2**(k+1))

        const angle2 = getAngle(f(c)-f(a), h/2**(k+1))

        if (angle1==angle2) break

        if (sign==-1) [a,b] = angle1 > angle2 ? [a,c] : [c,b]

        else [a,b] = angle1 < angle2 ? [a,c] : [c,b]



        if (sign==1 && valueIsInside(f(inita), f(initb), f(c)) ) break
                 
        if (sign==-1 && valueIsInside(f(initb), f(inita), f(c)) ) break

        if (k==n-1) {

            // const delta = (f(initb)-f(inita))/(f(b)-f(a))

            // console.log(delta)

            let [y1, y2] = [f(a), f(b)]

            // if (delta<1) [y1, y2] = [Math.sign(y1)*1e+20, Math.sign(y2)*1e+20]

            return [
                [a, y1],
                "discontinuity",
                [b, y2]
            ]
        }
    }

    return 0
}


const explicitGraph = (f,h,_x, resolution) => {

    // const h = cam/width

    // let _x = centerX - 0.5*cam

    let data = []

    for(let i=0; i<resolution; i++){

        if (i>=1) {
            const ang = getAngle( f(_x)-data[data.length-1][1], h)

            if (Math.abs(ang)>30) {

                const d = detectDiscontinuity(data[data.length-1][0], _x, h, ang, f, 200)

                if (typeof d=="object") data = data.concat(d)
            }
        }

        data.push([_x, f(_x)])

        _x += h
    }

    return data
}

// explicitGraph(x=>Math.tan(x),0.1,-10,100)
// console.log(explicitGraph(x=>Math.tan(x),2,-100,100))
// console.log(explicitGraph(x=>x*Math.floor(x),0.1,-10,100))

export { explicitGraph }
