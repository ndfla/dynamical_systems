import { loadPage } from "./pageLoader.js"

const pageMap = {

    logisticMapBifurcation: {
        title: 'bifurcation diagram of the logistic map',
        equation: 'x_{n+1} = ax_n(1 - x_n)',

        UIcontainer: {
            canvas:{
                type:"DDS",
                data:{ 
                    initwidth: 12.0,

                    iteration: 100,
                    threshold: 20,
                    initx: 0.5,

                    map: (a,x) => a*x*(1-x)
                }   
            },
            text: [
                "centerX",
                "pointerX",
                "centerY",
                "pointerY"
            ],
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45
                },
                initx:{
                    info: "initial x",
                    min: -2,
                    max: 2,
                    step:400,
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                },
                iteration: {
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                },
                threshold: {
                    info: "threshold",
                    min: 1,
                    max: 200,
                    step:199,  
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                }
            }
        }
    },
    logisticMapCobweb: {
        title: 'cobweb plot of the logistic map',
        equation: 'x_{n+1} = ax_n(1 - x_n)',

        UIcontainer: {
            canvas:{
                type:"CW",
                data:{ 
                    initwidth: 12.0,

                    magnification: 2,
                    a: -1.7,
                    x: 0.2,
                    iteration: 100,

                    transparency: 0.5,

                    map: (a,x) => a*x*(1-x)
                }   
            },
            text: [
                "centerX",
                "pointerX",
                "centerY",
                "pointerY"
            ],
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45
                },
                a:{
                    info: "a",
                    min: -4.5,
                    max: 4.5,
                    step:400,
                },
                x:{
                    info: "x",
                    min: -2,
                    max: 2,
                    step:100,
                },
                iteration:{   
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                },
                transparency: {
                    info: "line transparency",
                    min: 0.1,
                    max: 1.0,
                    step:9,
                }
            }
        }
    },

    tentMapBifurcation: {
        title: 'bifurcation diagram of the tent map',
        equation: `

        x_{n+1} = \\begin{cases} 
            ax_n & x_n < \\frac{1}{2}, \\\\
            a(1 - x_n) & x_n \\ge \\frac{1}{2},
        \\end{cases}`,

        UIcontainer: {
            canvas:{
                type:"DDS",
                data:{ 
                    initwidth: 12.0,

                    iteration: 100,
                    threshold: 20,
                    initx: 0.5,

                    map: (a,x) => a*Math.min(x, 1-x)
                }   
            },
            text: [
                "centerX",
                "pointerX",
                "centerY",
                "pointerY"
            ],
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45
                },
                initx:{
                    info: "initial x",
                    min: -0.2,
                    max: 1.2,
                    step:140,
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                },
                iteration: {
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                },
                threshold: {
                    info: "threshold",
                    min: 1,
                    max: 200,
                    step:199,  
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                },
            }
        }
    },
    tentMapCobweb: {
        title: 'cobweb plot of the tent map',
        equation: `
        x_{n+1} = \\begin{cases} 
            ax_n & x_n < \\frac{1}{2}, \\\\
            a(1 - x_n) & x_n \\ge \\frac{1}{2},
        \\end{cases}`,
        UIcontainer: {
            canvas:{
                type:"CW",
                data:{ 
                    initwidth: 12.0,

                    magnification: 2,
                    a: -1.7,
                    x: 0.2,
                    iteration: 100,

                    transparency: 0.5,

                    map: (a,x) => a*Math.min(x, 1-x)
                }   
            },
            text: [
                "centerX",
                "pointerX",
                "centerY",
                "pointerY"
            ],
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45
                },
                a:{
                    info: "a",
                    min: -4.5,
                    max: 4.5,
                    step:400,
                },
                x:{
                    info: "x",
                    min: -2,
                    max: 2,
                    step:100,
                },
                iteration:{   
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                },
                transparency: {
                    info: "line transparency",
                    min: 0.1,
                    max: 1.0,
                    step:9,
                }
            }
        }
    },

    nonlinearODE1: {
        title: 'orbit of nonlinear ODE',
        equation: `

        \\begin{cases} 
            x^{\\prime} = y \\\\
            y^{\\prime} = \\sin(x)
        \\end{cases}`,

        UIcontainer: {
            canvas:{
                type:"VF",
                data:{ 
                    initwidth: 12.0,

                    sample: 400,
                    h: 0.1,
                    initx: 1.0,
                    inity: 0.0,

                    fx: (x,y) => y,
                    fy: (x,y) => Math.sin(x)
                }   
            },
            text: [
                "centerX",
                "pointerX",
                "centerY",
                "pointerY"
            ],
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45
                },
                initx:{
                    info: "initial x",
                    min: -3*Math.PI,
                    max: 3*Math.PI,
                    step:400,
                },
                inity:{
                    info: "initial y",
                    min: -3*Math.PI,
                    max: 3*Math.PI,
                    step:400,
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                },
                h: {
                    info: "h",
                    min: 0.01,
                    max: 0.1,
                    step:9,
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                }
            }
        }
    },

}


const initializePage = (() =>{

    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    if (page in pageMap) loadPage(pageMap[page])
    else loadPage(pageMap['logisticMapBifurcation'])

})()


for (let page in pageMap) {

    document.getElementById(page).addEventListener('click', () => {

        const url = new URL(window.location)

        url.searchParams.set('page', page)
        window.history.replaceState({}, '', url)

        loadPage(pageMap[page])
    })
}