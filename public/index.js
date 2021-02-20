   
    async function main() {
        // let chartDiv = document.getElementById("chartDiv")
        const api_data = await (await fetch('api')).text()
        const data = await JSON.parse(api_data)
        data.forEach(x=>{
            x.users.forEach(y=>{
            y.username = y.username.replace('@','')
                
            })
        })
   
    
    const top_n = 14
    const tickDuration = 200

window.onload = createBarChartRace(data, top_n, tickDuration);

} 

main()

