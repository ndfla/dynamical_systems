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
                },
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],

                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                initx:{
                    info: "initial x",
                    min: -2,
                    max: 2,
                    step:400,
                    path: ["initx"]
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                    path: ["sample"]
                },
                iteration: {
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                    path: ["iteration"]
                },
                threshold: {
                    info: "threshold",
                    min: 1,
                    max: 200,
                    step:199,  
                    path: ["threshold"]
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                    path: ["scale", "y"]
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
                },
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],

                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                a:{
                    info: "a",
                    min: -4.5,
                    max: 4.5,
                    step:400,
                    path: ["a"]
                },
                x:{
                    info: "x",
                    min: -2,
                    max: 2,
                    step:100,
                    path: ["x"]
                },
                iteration:{   
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                    path: ["iteration"]
                },
                transparency: {
                    info: "line transparency",
                    min: 0.1,
                    max: 1.0,
                    step:9,
                    path: ["transparency"]
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
                },
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],
                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                initx:{
                    info: "initial x",
                    min: -0.2,
                    max: 1.2,
                    step:140,
                    path: ["initx"]
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                    path: ["sample"]
                },
                iteration: {
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                    path: ["iteration"]
                },
                threshold: {
                    info: "threshold",
                    min: 1,
                    max: 200,
                    step:199,  
                    path: ["threshold"]
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                    path: ["scale", "y"]
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
                }, 
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],
                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                a:{
                    info: "a",
                    min: -4.5,
                    max: 4.5,
                    step:400,
                    path: ["a"]
                },
                x:{
                    info: "x",
                    min: -2,
                    max: 2,
                    step:100,
                    path: ["x"]
                },
                iteration:{   
                    info: "iteration",
                    min: 10,
                    max: 1000,
                    step:99,
                    path: ["iteration"]
                },
                transparency: {
                    info: "line transparency",
                    min: 0.1,
                    max: 1.0,
                    step:9,
                    path: ["transparency"]
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
                },
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],
                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                initx:{
                    info: "initial x",
                    min: -3*Math.PI,
                    max: 3*Math.PI,
                    step:400,
                    path: ["initx"]
                },
                inity:{
                    info: "initial y",
                    min: -3*Math.PI,
                    max: 3*Math.PI,
                    step:400,
                    path: ["inity"]
                },
                sample:{   
                    info: "sample",
                    min: 100,
                    max: 1000,
                    step:9,
                    path: ["sample"]
                },
                h: {
                    info: "h",
                    min: 0.01,
                    max: 0.1,
                    step:9,
                    path: ["h"]
                },
                scaleY: {
                    info: "scaleY",
                    min: 0.5,
                    max: 5.0,
                    step:45,
                    path: ["scale", "y"]
                }
            }
        }
    },

    
    LissajousCurve: {
        title: 'Lissajous curve',
        equation:  `

        \\begin{cases} 
            x = A\\sin(at+\\delta) \\\\
            y = B\\cos(bt)
        \\end{cases}`,

        UIcontainer: {
            canvas:{
                type:"LC",
                data:{ 
                    initwidth: 12.0,

                    magnification: 2,

                    sample: 400,

                    A: 1.0,
                    B: 1.0,
                    a: 0.5,
                    b: 1.0,
                    delta: 1.0,

                    x: (A,a,delta,t) => A*Math.sin(a*t + delta),
                    y: (B,b,t) => B*Math.cos(b*t)
                },
                layer: 1   
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],
                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                A: {
                    info: "A",
                    min: -2,
                    max: 2,
                    step:40,
                    path: ["A"]
                },
                B: {
                    info: "B",
                    min: -2,
                    max: 2,
                    step:40,
                    path: ["B"]
                },
                a: {
                    info: "a",
                    min: -2,
                    max: 2,
                    step:40,
                    path: ["a"]
                },
                b: {
                    info: "b",
                    min: -2,
                    max: 2,
                    step:40,
                    path: ["b"]
                },
                delta: {
                    info: "delta",
                    min: -2,
                    max: 2,
                    step:40,
                    path: ["delta"]
                },
                sample: {
                    info: "curve sample",
                    min: 200,
                    max: 1000,
                    step:8,
                    path: ["sample"]
                }

            }
        }
    },

    LorentzSyetem: {
        title: 'orbit of Lorentz system ',
        equation:  `

        \\begin{cases} 
            x^{\\prime} = \\sigma (y-x) \\\\
            y^{\\prime} = x (\\rho - z) - y \\\\
            z^{\\prime} = xy - \\beta z
        \\end{cases}`,

        UIcontainer: {
            canvas:{
                type:"LS",
                data:{ 
                    initwidth: 12.0,

                    magnification: -3,

                    center: {
                        x:0,
                        y:40
                    },

                    sample: 1800,

                    initx: 0,
                    inity: 1,
                    initz: -3,

                    sigma: 3,
                    rho: 36,
                    beta: 1.5,
                    h: 0.005,

                    rotation: 0,
                    phi: 0,
                    theta: 0,
                }, 
            },
            text:  {},
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:45,
                    path: ["magnification"]
                },
                rotation: {
                    info: "rotation",
                    min: 0,
                    max: 2*Math.PI,
                    step:30,
                    path: ["rotation"]
                },
                initx:{
                    info: "initial x",
                    min: -10,
                    max: 10,
                    step:200,
                    path: ["initx"]
                },
                inity:{
                    info: "initial y",
                    min: -10,
                    max: 10,
                    step:200,
                    path: ["inity"]
                },
                initz:{
                    info: "initial z",
                    min: -10,
                    max: 10,
                    step:200,
                    path: ["initz"]
                },
                sigma:{
                    info: "sigma",
                    min: -2,
                    max: 4,
                    step:300,
                    path: ["sigma"]
                },
                rho:{
                    info: "rho",
                    min: 0,
                    max: 40,
                    step:40,
                    path: ["rho"]
                },
                beta:{
                    info: "beta",
                    min: 1,
                    max: 5,
                    step:200,
                    path: ["beta"]
                },
                sample:{   
                    info: "sample",
                    min: 300,
                    max: 3000,
                    step:9,
                    path: ["sample"]
                },
                h: {
                    info: "h",
                    min: 0.001,
                    max: 0.005,
                    step:5,
                    path: ["h"]
                },
            }
        }
    },

    Mandelbrot: {
        title: 'Mandelbrot set ',
        equation: `

        \\begin{cases} 
            z_{n+1} = {z_n}^2+c \\\\
            z_0 = 0
        \\end{cases}`
        ,

        UIcontainer: {
            canvas:{
                type:"MB",
                data:{ 
                    initwidth: 4,

                    center: {x: -1, y: 0},

                    iteration: 50,
                    contouring: 50,

                    julia: 0,
                    juliaRe: -0.6,
                    juliaIm: 0.42,

                }, 
            },
            text: {
                centerX:{ 
                    info: "centerX",
                    path: ["center", "x"],
                },
                pointerX: {
                    info: "pointerX",
                    path: ["pointer", "x"],
                },
                centerY: {
                    info: "centerY",
                    path: ["center", "y"],
                },
                pointerY: {
                    info: "pointerY",
                    path: ["pointer", "y"],
                }
            },
            slider:{
                magnification: {
                    info:"magnification",
                    min: -5,
                    max: 40,
                    step:90,
                    path: ["magnification"]
                },
                contouring: {
                    info:"contouring",
                    min: 10,
                    max: 200,
                    step:19,
                    path: ["contouring"]
                },
                iteration:{   
                    info: "iteration",
                    min: 10,
                    max: 200,
                    step:19,
                    path: ["iteration"]
                },
                julia: {
                    info: "julia",
                    min: 0,
                    max: 1,
                    step:1,
                    path: ["julia"]
                },
                juliaRe:{
                    info: "julia real",
                    min: -2,
                    max: 2,
                    step:200,
                    path: ["juliaRe"]
                },
                juliaIm:{
                    info: "julia imaginary",
                    min: -2,
                    max: 2,
                    step:200,
                    path: ["juliaIm"]
                },
            }
        }
    },
}


const initializePage = (() =>{

    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    if (page in pageMap) loadPage(pageMap[page])
    else loadPage(pageMap['logisticMapBifurcation'])

})();


for (let page in pageMap) {

    document.getElementById(page).addEventListener('click', () => {
        
        const url = new URL(window.location)

        url.searchParams.set('page', page)
        window.history.replaceState({}, '', url)

        loadPage(pageMap[page])
    })
}