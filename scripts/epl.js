let store = {};
let slider = {};

function loadData() {
  return Promise.all([
      d3.csv("data/epl_league_stats.csv"),
      d3.csv("data/epl_league_stats_with_NP_Teams.csv")
  ]).then(datasets => {
      store.data = datasets[0];
      store.data1 = datasets[1];
      return store;
  })
}

function getBoxConfig() {
  let container1 = d3.select("#Box1");
  let container2 = d3.select("#Box2");
  let container3 = d3.select("#Box3");
  let container4 = d3.select("#Box4");
  let legendContainer1 = d3.select("#Legend1");
  let legendContainer2 = d3.select("#Legend2");

  container1
    .attr("width", 920)
    .attr("height", 920)
  legendContainer1
    .attr("width", 150)
    .attr("height", 460)
  container2
    .attr("width", 560)
    .attr("height", 850)
  legendContainer2
    .attr("width", 106)
    .attr("height", 150)
  container3
    .attr("width", 710)
    .attr("height", 850)
  container4
    .attr("width", 710)
    .attr("height", 850)
  return {container1, container2, container3, container4, legendContainer1, legendContainer2}
}

function leaguePositionMatrix(container, legendContainer){
  let matrixViz = container.append("g")
                           .attr("transform", "translate(150,50)")
  let eplStatsSummaryByName = d3.nest()
                                .key((d)=> { return d.epl_team; })
                                .rollup((v)=> { return d3.mean(v, (d)=> { return d.season_position; }); })
                                .entries(store.data);
  eplStatsSummaryByName.sort((x,y)=>{
    return d3.ascending(x.value,y.value);
  })
  console.log(eplStatsSummaryByName);
  let epl_team_list = [];
  let epl_season_list = [];
  eplStatsSummaryByName.forEach((element)=> {
    epl_team_list.push(element.key);
  });
  store.data.forEach((element)=> {
    epl_season_list.push(element.epl_season);
  });
  epl_team_list = Array.from(new Set(epl_team_list));
  epl_season_list = Array.from(new Set(epl_season_list));
  let yScale = d3.scaleBand()
                 .domain(epl_team_list)
                 .range([0,850]);
  let xScale = d3.scaleBand()
                 .domain(epl_season_list)
                 .range([0,750]);
  let xAxis = d3.axisTop(xScale);
  let yAxis = d3.axisLeft(yScale);
  let xAxisGroup = container.append("g")
                            .attr("transform", "translate(150,50)")
                            .call(xAxis)
  let yAxisGroup = container.append("g")
                            .attr("transform", "translate(150,50)")
                            .call(yAxis)
  let yAxisLabel = container.append("text")
                            .attr("transform", "translate(70,40)")
                            .text("Epl Team")
  let xAxisLabel = container.append("text")
                            .attr("transform", "translate(480,20)")
                            .text("Epl Season")
  let cScaleTopFour = d3.scaleLinear()
                        .domain([4,2.5,1])
                        .range(["#e5f5e0","#a1d99b","#31a354"])
  let cScaleBottomThree = d3.scaleLinear()
                            .domain([17,18.5,20])
                            .range(["#fee6ce","#fdae6b","#e6550d"])
  matrixViz.selectAll("rect")
           .data(store.data1)
           .enter()
           .append("rect")
           .attr("fill",d=> {
             if(d.season_position<=4){
               return cScaleTopFour(d.season_position);
             }else if(d.season_position>=17){
               return cScaleBottomThree(d.season_position);
             }else if (d.season_position=="NP"){
               return "White";
             }else{
               return "#D3D3D3";
             }
           })
           .attr("width", xScale.bandwidth())
           .attr("height", yScale.bandwidth())
           .attr("y", d=> yScale(d.epl_team))
           .attr("x", d=> xScale(d.epl_season))
           .attr("stroke", "#C0C0C0")

  let legendLabel = legendContainer.append("text")
                                   .attr("transform", "translate(20,20)")
                                   .text("Season Position")
  let teamSeasonPositionLegendScale = d3.scaleBand()
                                        .domain(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"])
                                        .range([0,400]);
  let teamSeasonPositionLegendAxis = d3.axisLeft(teamSeasonPositionLegendScale);
  let teamSeasonPositionLegendAxisGroup = legendContainer.append("g")
                                                         .attr("transform", "translate(65,40)")
                                                         .call(teamSeasonPositionLegendAxis)
  let teamSeasonPositionLegend = legendContainer.append("g")
                                                .attr("transform", "translate(65,40)")
  let teamSeasonPositionLegendData = [
    {lp_cat:"1",lp_ord:1},
    {lp_cat:"2",lp_ord:2},
    {lp_cat:"3",lp_ord:3},
    {lp_cat:"4",lp_ord:4},
    {lp_cat:"5",lp_ord:5},
    {lp_cat:"6",lp_ord:6},
    {lp_cat:"7",lp_ord:7},
    {lp_cat:"8",lp_ord:8},
    {lp_cat:"9",lp_ord:9},
    {lp_cat:"10",lp_ord:10},
    {lp_cat:"11",lp_ord:11},
    {lp_cat:"12",lp_ord:12},
    {lp_cat:"13",lp_ord:13},
    {lp_cat:"14",lp_ord:14},
    {lp_cat:"15",lp_ord:15},
    {lp_cat:"16",lp_ord:16},
    {lp_cat:"17",lp_ord:17},
    {lp_cat:"18",lp_ord:18},
    {lp_cat:"19",lp_ord:19},
    {lp_cat:"20",lp_ord:20}
  ]
  teamSeasonPositionLegend.selectAll("rect")
                          .data(teamSeasonPositionLegendData)
                          .enter()
                          .append("rect")
                          .attr("fill",d=> {
                            if(d.lp_ord<=4){
                              return cScaleTopFour(d.lp_ord);
                            }else if(d.lp_ord>=17){
                              return cScaleBottomThree(d.lp_ord);
                            }else{
                              return "#D3D3D3";
                            }
                          })
                          .attr("width", 30)
                          .attr("height", teamSeasonPositionLegendScale.bandwidth())
                          .attr("y", d=> teamSeasonPositionLegendScale(d.lp_cat))
                          .attr("stroke", "#C0C0C0")
}

function eplSeasonSlider(){
  slider = d3.sliderHorizontal()
             .min(2006)
             .max(2016)
             .step(1)
             .width(1000)
             .tickFormat(d3.format("d"))
             .on('onchange', val => {
               epl_season = (val.toString())+"/"+((val+1).toString());
               let config = getBoxConfig();
               config.container2.selectAll("*").remove();
               config.legendContainer2.selectAll("*").remove();
               config.container3.selectAll("*").remove();
               config.container4.selectAll("*").remove();
               winDrawLossStackedBarChart(config.container2, config.legendContainer2, epl_season);
               goalDifferenceBarChart(config.container3, epl_season);
               totalPassesBarChart(config.container4, epl_season);
              });
  d3.select("div#slider").append("svg")
                         .attr("width", 1050)
                         .attr("height", 200)
                         .append("g")
                         .attr("transform", "translate(25,25)")
                         .call(slider);
}

function prevSliderValue(){
  console.log(slider.value());
  if(slider.value()!=2006){
    slider.value((slider.value()-1));
  }
}

function nextSliderValue(){
  console.log(slider.value());
  if(slider.value()!=2016){
    slider.value((slider.value()+1));
  }
}

function winDrawLossStackedBarChart(container, legendContainer, eplseason){
  let winBarChartViz = container.append("g")
                                .attr("transform", "translate(115,20)")
  let drawBarChartViz = container.append("g")
                                 .attr("transform", "translate(115,20)")
  let lossBarChartViz = container.append("g")
                                 .attr("transform", "translate(115,20)")
  filteredDataBySeason = store.data.filter(d=>{return d.epl_season == eplseason;})
  filteredDataBySeason = filteredDataBySeason.map(d=>{
    d.season_position = +d.season_position;
    d.matches_won = +d.matches_won;
    d.matches_lost = +d.matches_lost;
    d.matches_drawn = +d.matches_drawn;
    return d;
  })
  filteredDataBySeason.sort((x,y)=>{
    return d3.ascending(x.season_position,y.season_position);
  })
  console.log(filteredDataBySeason);
  let epl_team_list = [];
  filteredDataBySeason.forEach((element)=> {
    epl_team_list.push(element.epl_team);
  });
  let maxOfSumOfWinsDrawsLosses = d3.max(filteredDataBySeason, d=> (d.matches_won+d.matches_lost+d.matches_drawn));
  let xScale = d3.scaleLinear()
                 .range([0,464])
                 .domain([0,maxOfSumOfWinsDrawsLosses])
  let yScale = d3.scaleBand()
                 .domain(epl_team_list)
                 .range([0,785])
                 .padding(0.1);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  let xAxisGroup = container.append("g")
                            .attr("transform", "translate(115,805)")
                            .call(xAxis)
  let xAxisLabel = container.append("text")
                            .attr("transform", "translate(200,845)")
                            .text("Proportion of Wins, Draws & Losses")
  let yAxisGroup = container.append("g")
                            .attr("transform", "translate(115,20)")
                            .call(yAxis)
  let yAxisLabel = container.append("text")
                            .attr("transform", "translate(30,20)")
                            .text("Epl Team")
  winBarChartViz.selectAll("rect")
             .data(filteredDataBySeason)
             .enter()
             .append("rect")
             .attr("fill","#7570b3")
             .attr("width", d=> xScale(d.matches_won))
             .attr("height", yScale.bandwidth())
             .attr("y", d=> yScale(d.epl_team))
  drawBarChartViz.selectAll("rect")
                 .data(filteredDataBySeason)
                 .enter()
                 .append("rect")
                 .attr("fill","#d95f02")
                 .attr("width", d=> xScale(d.matches_drawn))
                 .attr("height", yScale.bandwidth())
                 .attr("y", d=> yScale(d.epl_team))
                 .attr("x", d=> xScale(d.matches_won))
  lossBarChartViz.selectAll("rect")
                 .data(filteredDataBySeason)
                 .enter()
                 .append("rect")
                 .attr("fill","#1b9e77")
                 .attr("width", d=> xScale(d.matches_lost))
                 .attr("height", yScale.bandwidth())
                 .attr("y", d=> yScale(d.epl_team))
                 .attr("x", d=> xScale(d.matches_won+d.matches_drawn))
  let legendScale = d3.scaleBand()
                      .domain(["Win","Draw","Loss"])
                      .range([0,100]);
  let legendAxis = d3.axisLeft(legendScale);
  let legendAxisGroup = legendContainer.append("g")
                                       .attr("transform", "translate(45,25)")
                                       .call(legendAxis)
  let legendGroup = legendContainer.append("g")
                                   .attr("transform", "translate(45,25)")
  let legendData = [
    {result:"Win"},
    {result:"Draw"},
    {result:"Loss"},
  ]
  legendGroup.selectAll("rect")
             .data(legendData)
             .enter()
             .append("rect")
             .attr("fill",d=> {
               if(d.result=="Win"){
                 return "#7570b3";
               }else if(d.result=="Draw"){
                 return "#d95f02";
               }else{
                 return "#1b9e77";
               }
             })
             .attr("width", 30)
             .attr("height", legendScale.bandwidth())
             .attr("y", d=> legendScale(d.result))
             .attr("stroke", "#C0C0C0")
}

function goalDifferenceBarChart(container, eplseason){
  let barChartViz = container.append("g")
                             .attr("transform", "translate(115,20)")
  filteredDataBySeason = store.data.filter(d=>{return d.epl_season == eplseason;})
  filteredDataBySeason = filteredDataBySeason.map(d=>{
    d.season_position = +d.season_position;
    d.goal_difference = +d.goal_difference;
    return d;
  })
  filteredDataBySeason.sort((x,y)=>{
    return d3.ascending(x.season_position,y.season_position);
  })
  console.log(filteredDataBySeason);
  let epl_team_list = [];
  filteredDataBySeason.forEach((element)=> {
    epl_team_list.push(element.epl_team);
  });
  let maxGoalDifference = d3.max(filteredDataBySeason, d=> d.goal_difference);
  let minGoalDifference = d3.min(filteredDataBySeason, d=> d.goal_difference);
  let xScale = d3.scaleLinear()
                 .range([0,570])
                 .domain([minGoalDifference-10,maxGoalDifference+5])
  let positiveGoalDifferenceScale = d3.scaleLinear()
                                      .range([0,342])
                                      .domain([0,(maxGoalDifference+5)])
  let negativeGoalDifferenceScale = d3.scaleLinear()
                                      .range([0,228])
                                      .domain([0,-(minGoalDifference-10)])

  let yScale = d3.scaleBand()
                 .domain(epl_team_list)
                 .range([0,785])
                 .padding(0.1);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  let xAxisGroup = container.append("g")
                            .attr("transform", "translate(115,805)")
                            .call(xAxis)
  let xAxisLabel = container.append("text")
                            .attr("transform", "translate(360,845)")
                            .text("Goal Difference")
  let yAxisGroup = container.append("g")
                            .attr("transform", "translate(115,20)")
                            .call(yAxis)
  let yAxisLabel = container.append("text")
                            .attr("transform", "translate(30,20)")
                            .text("Epl Team")
  barChartViz.selectAll("rect")
             .data(filteredDataBySeason)
             .enter()
             .append("rect")
             .attr("fill","#7570b3")
             .attr("width", d=>{
                if(d.goal_difference<0){
                    return negativeGoalDifferenceScale(-d.goal_difference);
                }
                else{
                    return positiveGoalDifferenceScale(d.goal_difference);
                }
             })
             .attr("height", yScale.bandwidth())
             .attr("y", d=> yScale(d.epl_team))
             .attr("x", d=>{
                if(d.goal_difference<0){
                    return (xScale(0)-negativeGoalDifferenceScale(-d.goal_difference));
                }
                else{
                    return (xScale(0));
                }
             })
  let referenceLine = container.append("g")
                               .attr("transform", "translate(115,20)")
      referenceLine.append("line")
                   .attr("x1",xScale(0))
                   .attr("y1",0)
                   .attr("x2",xScale(0))
                   .attr("y2",785)
                   .attr("stroke-width", 1)
                   .attr("stroke", "#C0C0C0");
}

function totalPassesBarChart(container, eplseason){
  let barChartViz = container.append("g")
                             .attr("transform", "translate(115,20)")
  filteredDataBySeason = store.data.filter(d=>{return d.epl_season == eplseason;})
  filteredDataBySeason = filteredDataBySeason.map(d=>{
    d.season_position = +d.season_position;
    d.total_through_balls = +d.total_through_balls;
    d.total_passes = +d.total_passes;
    d.total_long_balls = +d.total_long_balls;
    d.total_crosses = +d.total_crosses;
    d.total_backward_pass = +d.total_backward_pass;
    d.total_passes_completed = d.total_through_balls+d.total_passes+d.total_long_balls+d.total_crosses+d.total_backward_pass;
    return d;
  })
  filteredDataBySeason.sort((x,y)=>{
    return d3.ascending(x.season_position,y.season_position);
  })
  console.log(filteredDataBySeason);
  let epl_team_list = [];
  filteredDataBySeason.forEach((element)=> {
    epl_team_list.push(element.epl_team);
  });
  let maxPassesCompleted = d3.max(filteredDataBySeason, d=> d.total_passes_completed);
  let xScale = d3.scaleLinear()
                 .range([0,570])
                 .domain([0,maxPassesCompleted])
  let yScale = d3.scaleBand()
                 .domain(epl_team_list)
                 .range([0,785])
                 .padding(0.1);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  let xAxisGroup = container.append("g")
                            .attr("transform", "translate(115,805)")
                            .call(xAxis)
  let xAxisLabel = container.append("text")
                            .attr("transform", "translate(360,845)")
                            .text("Total Passes")
  let yAxisGroup = container.append("g")
                            .attr("transform", "translate(115,20)")
                            .call(yAxis)
  let yAxisLabel = container.append("text")
                            .attr("transform", "translate(30,20)")
                            .text("Epl Team")
  barChartViz.selectAll("rect")
             .data(filteredDataBySeason)
             .enter()
             .append("rect")
             .attr("fill","#7570b3")
             .attr("width", d=> xScale(d.total_passes_completed))
             .attr("height", yScale.bandwidth())
             .attr("y", d=> yScale(d.epl_team))
}

function drawViz() {
    console.log(store.data);
    let config = getBoxConfig();
    leaguePositionMatrix(config.container1, config.legendContainer1);
    winDrawLossStackedBarChart(config.container2, config.legendContainer2, "2006/2007");
    goalDifferenceBarChart(config.container3, "2006/2007");
    totalPassesBarChart(config.container4, "2006/2007");
    eplSeasonSlider();
}

loadData().then(drawViz);
