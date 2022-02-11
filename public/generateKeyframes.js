
  export function generateKeyframes(data) {
    // separar um array de datas e dos valores correspondentes
    //1 array com todas as datas
    //um array com todos os valores pra cada 1

    const [domain , ranges] = getTimeDomainAndRanges(data)

    

    // criar as escalas
      // para cada item, cria um map de [data inicial - final] para [datapoint]
    let rangeScales = d3.keys(ranges).map((key) => {
      return {
        key: key,
        scale: d3.scaleLinear(domain, ranges[key]),
      };
    });

    // gerar os keyframes com os dados de cada um
    // len = tickDuration * ticks/fps
    const frames = 120;

    let timeMinMax = d3.extent(domain);
    let timeScale = d3.scaleTime(timeMinMax, [0, frames]);

    let keyframes = [];
    for (let i = 0; i <= frames; i++) {
      let date = timeScale.invert(i);
      let frame = {
        date: date,
        data: [],
      };
      frame.data = rangeScales.map((scale) => {
        const value = parseInt(scale.scale(date));
        return {
          key: scale.key,
          value: value,
        };
      });

      keyframes.push(frame);
    }

    return {
      keyframes: keyframes,
      timeScale: timeScale,
    };

    function getLastValid(arr,i,acessor){
      if (i == 0){
        return {i:0,v:'0'} 
      }
      const v = acessor(arr[i])
      if (!isNaN(v)){
        return {i,v}
      }
      return getLastValid(arr,i-1,acessor)
    }

    function getNextValid(arr,i,acessor){
      if (i >= arr.length-1){
        return {i:arr.length-1,v:getLastValid(arr,i,acessor).v} 
      }
      const v = acessor(arr[i])
      if (!isNaN(v)){
        return {i,v}
      }
      return getNextValid(arr,i+1,acessor)
    }


    function fillInvalidData(data){
      const last = {}
      const ndata = data.map((entry, i, xs) => {
        const obj = {}
        for (const key in entry){
          const value = entry[key]
          if (isNaN(value)){
            const lValid = getLastValid(xs,i,x=>x[key])
            const nValid = getNextValid(xs,i,x=>x[key])

            const estimatedValue = d3.scaleLinear([lValid.i, nValid.i],[lValid.v, nValid.v])(i)

            obj[key]=estimatedValue

          }
          else{
            obj[key]=value
          }

        }
        return obj
        
      })

      return ndata

    }

    function getTimeDomainAndRanges(data){
      //console.log('data',data.map(x=>x['Costa Rica']))
        let ranges = {};
        let domain = [];

      const ndata = fillInvalidData(data)

      //console.log('ndata',ndata.map(x=>x['Costa Rica']))

        ndata.forEach((entry) => {
          //const entry = data[i]
          domain.push(new Date(entry.date));
          delete entry.date 
          for (const key of Object.keys(entry)) {
            const value = entry[key];
            if (!ranges[key]) {
              ranges[key] = [];
            }
            ranges[key].push(value);
          }
        });

        return [domain, ranges]
    }
  }
