function createBarChartRace(data, top_n, tickDuration) {
    // data: [...,{...,key:value,...},...]
    var data = data;
    console.log('data',data)
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

    //         return { nome:nome ,scale: d3.scaleQuantile(dominio,ranges[nome])}
    //     })
    //     // console.log(escalas)
    //     // gerar os keyframes com os dados de cada um
    //         // len = tickDuration * ticks/fps
    //     const frames = 59
    //     let dateMinMax = d3.extent(dominio)
    //     let timeScale = d3.scaleTime(dateMinMax,[0,frames])
    //     let keyframes = []
    //     // console.log('datemm',dateMinMax)
    //     for(let i =0;i<frames;i++){
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
    //     // console.log('keyframes',keyframes)
    //     return keyframes
    // }
    // data = generateKeyframes(data)
    // console.log('data2',data)
    
    let chartDiv = document.getElementById("chartDiv");
    chartDiv.textContent = '';
    let width = chartDiv.clientWidth;
    let height = chartDiv.clientHeight - 50;

    let svg = d3.select(chartDiv).append("svg")
        .attr("width", width)
        .attr("height", height);

    let timeline_svg = d3.select(chartDiv).append("svg")
        .attr("width", width)
        .attr("height", 50);

    const margin = {
        top: 50,
        right: 200,
        bottom: 50,
        left: 200
    };

    const marginTimeAxis = 200;

    let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);
        //problema do tempo eh aki

    function getRowData(data, column_names, row_index) {
        // row index eh o frame
        const row = data[row_index];

        let new_data = column_names.map((name) => {
            return {name: name, value: row[name]}
        });

        new_data = new_data.sort((a, b) => b.value - a.value).slice(0, top_n); //sort e tira os q n entrar no top n
        new_data.forEach((d, i) => {
            d.rank = i; 
            d.lastValue = (row_index > 0) ? data[row_index - 1][d.name] : d.value;
        });
        let time = row[d3.keys(row)[0]]
        return [time, new_data]
    }


    const time_index = d3.keys(data[0])[0];
    const column_names = d3.keys(data[0]).slice(1,);

    // define a random color for each column
    const colors = {};
    const color_scale = d3.scaleOrdinal(d3.schemeSet3);

    column_names.forEach((name, i) => {
        colors[name] = color_scale(i)
    });

    // Parse data
    data.forEach((d) => {
        // first column : YYYY-MM-DD
        const parseTime = d3.timeParse("%Y-%m-%d");
        d[time_index] = parseTime(d[time_index]);
        // convert other columns to numbers
        column_names.forEach((k) => d[k] = Number(d[k]))

    });

    // draw the first frame

    [time, row_data] = getRowData(data, column_names, 0);

    start_date = d3.min(data, d => d[time_index]);
    end_date = d3.max(data, d => d[time_index]);
      
        // escalas e axis
    let t = d3.scaleTime()
        .domain([start_date, end_date])
        .range([margin.left + marginTimeAxis, width - margin.right]);

    let timeAxis = d3.axisBottom()
        .ticks(5)
        .scale(t);

    let x = d3.scaleLinear()
        .domain([0, d3.max(row_data, d => d.value)])
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(5)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    // grupo do eixo x
    svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis) //?
        .selectAll('.tick line')
        .classed('origin', d => d === 0); //?

    // crias os retangulo
    svg.selectAll('rect.bar') 
        .data(row_data, d => d.name)    //key function seta id e retorna data
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', d => x(d.value) - x(0)) //d.value?? d = row_data?
        .attr('y', d => y(d.rank) + barPadding / 2)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => colors[d.name]);

    //label da esquerda
    svg.selectAll('text.label')
        .data(row_data, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        // .attr('x', d => x(d.value) - 8)  //<-- por isso ele desliza
        .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.name); //<-- conteudo

    svg.selectAll('text.valueLabel')
        .data(row_data, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1)
        .text(d => d3.format(',.0f')(d.lastValue)); //lastvalue?

    // svg.append('rect')
    //     .attr('y', height - margin.bottom)
    //     .attr('width', width)
    //     .attr('height', margin.bottom)
    //     .style('fill', '#ffffff')


    timeline_svg.append('g')
        .attr('class', 'axis tAxis')
        .attr('transform', `translate(0, 20)`)
        .call(timeAxis);

    timeline_svg.append('rect')
        .attr('class', 'progressBar')
        .attr('transform', `translate(${marginTimeAxis}, 20)`)
        .attr('height', 2)
        .attr('width', 0);

    let timeText = svg.append('text')
        .attr('class', 'timeText')
        .attr('x', width - margin.right)
        .attr('y', height - margin.bottom - 5)
        .style('text-anchor', 'end')
        .html(d3.timeFormat("%B %d, %Y")(time));

    // draw the updated graph with transitions
    function drawGraph() {
        // update xAxis with new domain
        x.domain([0, d3.max(row_data, d => d.value)]);
        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);

        // update bars
        let bars = svg.selectAll('.bar').data(row_data, d => d.name);

        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', x(0) + 1)
            .attr('width', d => x(d.value) - x(0))
            //enter from out of screen
            .attr('y', d => y(top_n + 1) + 0)
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', d => colors[d.name])
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + barPadding / 2);

        bars.transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0))
            .attr('y', d => y(d.rank) + barPadding / 2);

        bars.exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0))
            .attr('y', d => y(top_n + 1) + barPadding / 2)
            .remove();

        // update labels
        let labels = svg.selectAll('.label').data(row_data, d => d.name);

        labels.enter().append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value) - 8)
            .attr('y', d => y(top_n + 1) + ((y(1) - y(0)) / 2))
            .style('text-anchor', 'end')
            .html(d => d.name)
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1);

        labels.transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(0) - 8) //0 pros lables ficarem no lugar
            .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1);

        labels.exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) - 8)
            .attr('y', d => y(top_n + 1)).remove();

        // update value labels

        let valueLabels = svg.selectAll('.valueLabel').data(row_data, d => d.name);

        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1))
            .text(d => d3.format(',.0f')(d.lastValue))
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1)
            // animacaozinha
            .tween("text", function (d) {
                let i = d3.interpolateNumber(d.lastValue, d.value);
                return function (t) {
                    this.textContent = d3.format(',.0f')(i(t));
                };
            });


        valueLabels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1)).remove()

        // update time label and progress bar
        d3.select('.progressBar')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', t(time) - marginTimeAxis)
        // .on('end', () => {
        //     d3.select('.timeText').html(d3.timeFormat("%B %d, %Y")(time))
        // timeText.html(d3.timeFormat("%B %d, %Y")(time))
        // })
        timeText.html(d3.timeFormat("%B %d, %Y")(time))

    }

    // loop
    let i = 1;
    let interval = d3.interval((e) => { //For + sleep
        [time, row_data] = getRowData(data, column_names, i);
        drawGraph();
        console.log('draw')
        // increment loop
        i += 1
        if (i == data.length) interval.stop()


    }, tickDuration)
    return interval


}
