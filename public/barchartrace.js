function createBarChartRace(data, top_n, tickDuration) {
    // data: [...,{date:Date,[key:value,...]},...]
    var data = data;

    function generateKeyframes(data) {
        // criarScale pra cada pessoa
        // separar um array de datas e dos valores correspondentes
        //1 array com todas as datas
        //um array com todos os valores pra cada 1
        let ranges = {}
        let domain = []
        for (entry of data) {
            domain.push(new Date(entry.date))
            for (user of entry.users) {
                const key = user.username
                const value = user.followers
                if (!ranges[key]) {
                    ranges[key] = []
                }
                ranges[key].push(value)
            }
        }

        // criar as escalas
        let rangeScales = d3.keys(ranges).map(key => {
            return {
                key: key,
                scale: d3.scaleLinear(domain, ranges[key])
            }
        })

        // gerar os keyframes com os dados de cada um
        // len = tickDuration * ticks/fps
        const frames = 120

        let timeMinMax = d3.extent(domain)
        let timeScale = d3.scaleTime(timeMinMax, [0, frames])


        let keyframes = []
        for (let i = 0; i <= frames; i++) {

            let date = timeScale.invert(i)
            let frame = {
                date: date,
                data: []
            }
            frame.data = rangeScales.map(scale => {
                const value = parseInt(scale.scale(date))
                return {
                    key: scale.key,
                    value: value
                }
            })


            keyframes.push(frame)
        }

        return {
            keyframes: keyframes,
            timeScale: timeScale
        }
    }

    const {
        keyframes: normalizedData,
        timeScale
    } = generateKeyframes(data)


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


    function getRowData(keyframes, row_index) {

        //sort, rank, lastvalue

        const {
            date,
            data
        } = keyframes[row_index];
        // retorna array de key e values
        // let new_data = column_names.map((name) => {
        //     return {name: name, value: row[name]}
        // });
        //sort e tira os q n entrar no top n

        out = data.sort((a, b) => parseInt(b.value) - parseInt(a.value))
            .slice(0, top_n)
            .filter(x => parseInt(x.value) > 0)
            .map((d, i) => {
                d.rank = i;
                let lValue = function () {
                    if (row_index == 0) {
                        
                        return d.value
                    } else

                        return keyframes[row_index-1].data.filter(user => user.key == d.key)[0].value
                };
                d.lastValue = lValue()
                return d
            });

 
        return {
            date: date,
            values: out
        }
    }

    //trocar pra nomes

    const column_names = normalizedData[0].data.map(x => x.key);


    // define a random color for each column
    const colors = {};
    const color_scale = d3.scaleOrdinal(d3.schemeSet3);

    column_names.forEach((name, i) => {
        // colors[name]='#1DA1F2'
        colors[name] = color_scale(i)
    });

    // draw the first frame

    let {
        date: time,
        values: row_data
    } = getRowData(normalizedData, 0);
   
  const [start_date, end_date] = d3.extent(data.map(x=>x.date))
    let t = d3.scaleTime()
        .domain([new Date(start_date), new Date(end_date)])
        .range([margin.left + marginTimeAxis, width - margin.right]);


    let timeAxis = d3.axisBottom()
    //colocar ticks = dias
        .ticks(d3.timeHour.every(24))
        .tickFormat((d,i)=>{
            if(i%3==0){
                return d3.timeFormat('%d/%m')(d)
            }
    })
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
        .data(row_data, d => d.key) //key function seta id e retorna data
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', d => x(d.value) - x(0)) //d.value?? d = row_data?
        .attr('y', d => y(d.rank) + barPadding / 2)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => colors[d.key]);

    //label da esquerda
    svg.selectAll('text.label')
        .data(row_data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'label')
        // .attr('x', d => x(d.value) - 8)  //<-- por isso ele desliza
        .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.key); //<-- conteudo

    svg.selectAll('text.valueLabel')
        .data(row_data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + ((y(1) - y(0)) / 2) + 1)
        .text(d => d3.format(',.0f')(d.lastValue)); //lastvalue?

        timeline_svg.append('rect')
        .attr('class', 'progressBar')
        .attr('fill','#1DA1F2')
        .attr('transform', `translate(${marginTimeAxis}, 20)`)
        .attr('height', 5)
        .attr('width', 0);

        timeline_svg.append('g')
            .attr('class', 'axis tAxis')
            .attr('transform', `translate(0, 20)`)
            .call(timeAxis);
        
    let timeText = svg.append('text')
        .attr('class', 'timeText')
        .attr('x', width - margin.right)
        .attr('y', height - margin.bottom - 5)
        .style('text-anchor', 'end')
        .html(d3.timeFormat("%B %d, %Y")(time));

    // draw the updated graph with transitions
    function drawGraph(time,row_data) {
        // update xAxis with new domain
        x.domain([0, d3.max(row_data, d => d.value)]);
        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);

        // update bars
        let bars = svg.selectAll('.bar').data(row_data, d => d.key);


        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', x(0) + 1)
            .attr('width', d => x(d.value) - x(0))
            //enter from out of screen
            .attr('y', d => y(top_n + 1) + 0)
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', d => colors[d.key])
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
            .duration(tickDuration-50)
            // .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0))
            .attr('y', () => y(top_n + 1) + barPadding / 2)
            .remove()



        // update labels
        let labels = svg.selectAll('.label').data(row_data, d => d.key);

        labels.enter().append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value) - 8)
            .attr('y', d => y(top_n + 1) + ((y(1) - y(0)) / 2))
            .style('text-anchor', 'end')
            .html(d => d.key)
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
            .duration(tickDuration-50)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) - 8)
            .attr('y', d => y(top_n + 1)).remove();

        // update value labels

        let valueLabels = svg.selectAll('.valueLabel').data(row_data, d => d.key);

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
            .duration(tickDuration-50)
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
        if (i == normalizedData.length-1) interval.stop()

        let {date,values} = getRowData(normalizedData, i);

        drawGraph(date,values);

        i += 1


        return interval
    }, tickDuration)
   
    
}
