   let refresh = false

//    se tiver no celular em pé pede pra virar e atualiza 
   var sOrientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

   if (sOrientation === "landscape-primary") {
       console.log("That looks good.");
   } else if (sOrientation === "landscape-secondary") {
       console.log("Mmmh... the screen is upside down!");
   } else if (sOrientation === "portrait-secondary" || sOrientation === "portrait-primary") {
       document.querySelector('h1').innerText = "Por favor coloque o celular de lado (a versão de cel ta meio porca ainda, sorry)"
       window.onorientationchange = function (event) {
           document.querySelector('h1').innerText = "arigatô"
           location.reload();
       };
       console.log("Mmmh... you should rotate your device to landscape");
   } else if (sOrientation === undefined) {
       console.log("The orientation API isn't supported in this browser :(");
   }

// funcçao assincrona pra fazer o request na api
   async function main() {
       // let chartDiv = document.getElementById("chartDiv")
       const api_data = await (await fetch('api')).text()
       const data = await JSON.parse(api_data)
    //    no bd tem usernames com e sem @
       data.forEach(x => {
           x.users.forEach(y => {
               y.username = y.username.replace('@', '')

           })
       })

       const top_n = 14
       const tickDuration = 200


       window.onload = createBarChartRace(data, top_n, tickDuration)
       // setTimeout(chart.stop(),1000)

   }

   function rButton() {
       refresh = true
   }


   main()