let [x,y,t,h] = [1,0,0,0.01]

const d =adams([x,y], [(x,y)=>-y, (x,y)=>x], 0.01,500)

console.log(d.map((v) => v[0]**2 + v[1]**2))
