
// class Header{
//     constructor(data){
//         const maisRecente = data[data.length-1].users
//         const set =[...new Set(maisRecente.map(x=>x.username))].sort()
//         this.str = ['date',...set]
//         this.index=[...set]
//         // this.labels = ['date',...data[data.length-1].users.name]
//     }
// }

// class Row {

//     constructor(obj,index){
//         this.date = obj.date.substr(0,10)
//         this.values = this.getValues(obj.users,index)
//         this.str = [this.date,...this.values].join(',')
//     }


// }
// Row.prototype.getValues = function(users,index){
//     let values = new Array(index.length).fill(0)
//         users.forEach((user)=>{
    //             let i = index.indexOf(username)
    //             values[i]=user.followers
    //         })
    //     return values
    
    // }
    
    
    async function main() {
        // let chartDiv = document.getElementById("chartDiv")
        const api_data = await (await fetch('api')).text()
        const data = await JSON.parse(api_data)
        data.forEach(x=>{
            x.users.forEach(y=>{
            y.username = y.username.replace('@','')
                
            })
        })
    // const header = new Header(data)
    // const body = data.map(entry => {
    //     return new Row(entry,header.index).str
    // })
    // const csv = [header.str,...body].join('\n')
    // const row = new Row(data[40],header.index)
    // console.log(csv)
    
    // data.forEach((entry)=>{

    //     let a = new row(entry)

    // })
    // Papa.parse(csv, {
    //     header: true,
    //     skipEmptyLines: true,
    //     complete: function (results) {
    //         newdata = results.data;
    //         // self.top_n = Math.min(20, Object.keys(self.csv_data[0]).length - 1)
    //     }
    // })
    

    
    let top_n = 14

    let tickDuration = 200

    // function generateKeyframes(data){
    //     // criar quantileScale pra cada pessoa
    //         // separar um array de datas e dos valores correspondentes
    //         //1 array com todas as datas
    //         //um array com todos os valores pra cada 1
    //         data = data.map(x=>{
    //             x.date = new Date(x.date)
    //             return x
    //         })
    //     let ranges = {}
    //     data.forEach(entry =>{
    //         for (key of d3.keys(entry)){
    //             if (!ranges[key]){ranges[key]=[]}
    //             ranges[key].push(entry[key])
    //         }
            
    //     })
    //     let dominio = ranges['date']
    //     delete ranges['date']

    //     // criar as escalas
    //     let escalas = d3.keys(ranges).map(nome=>{

    //         return { nome:nome ,scale: d3.scaleLinear(dominio,ranges[nome])}
    //     })
    //     // console.log(escalas)
    //     // gerar os keyframes com os dados de cada um
    //         // len = tickDuration * ticks/fps
    //     const frames = 120
    //     let dateMinMax = d3.extent(dominio)
    //     let timeScale = d3.scaleTime(dateMinMax,[0,frames])
    //     let keyframes = []
    //     // console.log('datemm',dateMinMax)
    //     for(let i =0;i<=frames;i++){
    //         let date = timeScale.invert(i)
    //         let dateStr = date.toISOString().substr(0,10)
    //         // console.log('str',dateStr)
    //         let frame = {date:dateStr}
    //         escalas.forEach((obj)=>{
    //             // console.log(obj)
    //             frame [obj.nome]=obj.scale(date)
                
    //         })
    //         keyframes.push(frame)
    //     }
    //     keyframes.shift()
    //     console.log('keyframes',keyframes)
    //     return keyframes
    // }
    
window.onload = createBarChartRace(data, top_n, tickDuration);

} 

main()


// dar uma olhada no original e logar o formato dos dados q entram na função
    //ou mudar funçao pra aparecer lables e dias certos
    //ou fazer formato igual transformando o q eu fiz em csv e usando papaparse
