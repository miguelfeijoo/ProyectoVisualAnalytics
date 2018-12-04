var margin = {top: 100, right: 0, bottom: 10, left: 10},
  width = 900 - margin.left - margin.right,
  height =320 - margin.top - margin.bottom;

var marginT = {top: 100, right: 0, bottom: 10, left: 10},
  widthT = 900 - marginT.left - marginT.right,
  heightT = 450 - marginT.top - marginT.bottom;



// append the svg object to the body of the page
var svg = d3.select("#graph")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var svgT = d3.select("#graphT")
.append("svg")
  .attr("width", widthT + marginT.left + marginT.right)
  .attr("height", heightT + marginT.top + marginT.bottom)
.append("g")
  .attr("transform",
        "translate(" + marginT.left + "," + marginT.top + ")");



//initial value
updateGrap("A");

// handle on click event for dropdown
d3.select("#d3-dropdown2")
  .on('change', function() {
    var newValue = eval(d3.select(this).property('value'));
    updateGrap(newValue);

});



// Function for create the initial heatmap

function updateGrap(value) {

d3.csv("data/dataset.csv").then(function(data) {
  console.log(data);
   data.forEach(function(d) {
   d.Tipo_Est=d.type_est;
   d.Modulo=d.modulo;
   d.Leccion=d.course_branch_lesson_name;
   d.Actividad = d.item;
   d.Participantes_Modulo=+d.part_modulo;
   d.Participantes_Leccion=+d.part_leccion;
   d.Participantes_actividad=+d.part_item;
   d.Completitud_Modulo=+d.completitud_modulo*100;
   d.Completitud_Leccion=+d.completitud_lec*100;

              });



 // Create  dropdown with selection by estado



var dataM=data.filter(d => d.Tipo_Est==value) 
console.log("pepe" +JSON.stringify(dataM));
var resumen = d3.nest()
    .key(function(d){
      return d.Modulo
    })

   
  .rollup(function(leaves){
      return d3.min(leaves, function(d) {return (d.Completitud_Modulo)});
    })
    .entries(dataM)
    console.log(resumen) 
    resumen.forEach(function(d) {
   d.Modulo = d.key;
   d.value = +d.value;
   d.Categoria_1 = " "
   });
   

var myGroups = d3.map(resumen, function(d){return d.Modulo;}).keys()
var myVars = d3.map(resumen, function(d){return d.Categoria_1;}).keys()

var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);


 svg.append("g")
    .attr("class", "x axis")
    .style("font-size", 10)
    .attr("transform", "translate(0," + 1 + ")")
    .call(d3.axisBottom(x).tickSize(0.1))
    .selectAll(".tick text")
            .style("text-anchor", "middle")
            .call(wrap, x.bandwidth())
    .select(".domain").remove();
    

var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.08);

  svg.append("g")
    .attr("class", "y axis")
    .style("font-size", 10)
    .call(d3.axisLeft(y).tickSize(1))
    .select(".domain").remove()


   // Build color scale
var myColor = d3.scaleSequential()
    .interpolator(d3.interpolate("white", "steelblue"))
    .domain([0,100])



//Add tooltip modulo

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .style("visibility","visible")
  .offset([-20, 0])
  .html(function(d) {
    return "Módulo: <span style='color:darkblue'>" + d.Modulo + " " +    "</span>" + "<strong>Completitud:</strong> <span style='color:darkblue'>" + d.value + "%" +    "</span>";
  })
svg.call(tip);



  // add the squares
  svg.selectAll()
    .data(resumen, function(d) {return d.Modulo+':'+d.Categoria_1;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Modulo) })
      .attr("y", function(d) { return y(d.Categoria_1)+10 })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth()- 60 )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      //.style("opacity", 0.5)
      .style("position","absolute")
      .on('mouseover', tip.show)
      .on('mouseout' , tip.hide)
      .on('click', function(d) {
       updateGrapL(value,d.Modulo)})
      ; 





//Add legend to graphs

var myColor = d3.scaleSequential()
    .interpolator(d3.interpolate("white", "steelblue"))
    .domain([0,100]);



var legend = svg.selectAll(".legend")
      .data(myColor.ticks(6).slice(0))
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (500 + i * 50) + "," + (170) + ")"; });

  legend.append("rect")
      .attr("width", 50)
      .attr("height", 30)
      .style("stroke", "black")
      .style("fill", myColor);

  legend.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", width + 200)
      .attr("y", 1000)
      .attr("dy", ".35em")
      .text("Escala");





// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Nivel de completitud por módulo");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 1000)
        .text("Este gráfico presenta el nivel de completitud, por módulo. Los módulos con menor porcentaje, se presentan en color más claro.")

svg.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 1000)
        .text("Para ver el porcentaje de completitud de las lecciones de un módulo específico, haga click en el cuadro del módulo.");



})


};


//Funcion que centra .tick 
  function wrap(text, width) {
    //console.log("Entre")
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")

    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}


//Function for create a second heatmap

//updateGrapL("A", "Números naturales y sistemas de numeración") 

//updateGrapL("A", "Bienvenida")

function updateGrapL(value, value2) {

d3.csv("data/dataset.csv").then(function(data) {
  console.log(data);
   data.forEach(function(d) {
   d.Tipo_Est=d.type_est;
   d.Modulo=d.modulo;
   d.Leccion=d.course_branch_lesson_name;
   d.Actividad = d.item;
   d.Participantes_Modulo=+d.part_modulo;
   d.Participantes_Leccion=+d.part_leccion;
   d.Participantes_actividad=+d.part_item;
   d.Completitud_Modulo=+d.completitud_modulo*100;
   d.Completitud_Leccion=+d.completitud_lec*100;

   });
 // Create  dropdown with selection by estado


var dataL=data.filter(d => d.Tipo_Est==value & d.Modulo==value2) 
var resumenL = d3.nest()
    .key(function(d){
      return d.Leccion
    })

   
  .rollup(function(leaves){
      return d3.min(leaves, function(d) {return (d.Completitud_Leccion)});
    })
    .entries(dataL)
    console.log(resumenL) 
    resumenL.forEach(function(d) {
   d.Leccion = d.key;
   d.value = +d.value;
   d.Categoria_1 = " "
   });
   

var myGroups = d3.map(resumenL, function(d){return d.Leccion;}).keys()
var myVars = d3.map(resumenL, function(d){return d.Categoria_1;}).keys()

var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.005);





var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.1);
 


   // Build color scale
var myColor = d3.scaleSequential()
    .interpolator(d3.interpolate("white", "steelblue"))
    .domain([0,100])



//Add tooltip modulo

var tipT = d3.tip()
  .attr('class', 'd3-tip')
  .style("visibility","visible")
  .offset([-20, 0])
  .html(function(d) {
    return "Lección: <span style='color:darkblue'>" + d.Leccion + " " +    "</span>" + "<strong>Completitud:</strong> <span style='color:darkblue'>" + d.value + "%" +    "</span>";
  })
svgT.call(tipT);



  // add the squares
  var bars= svgT.selectAll().data(resumenL, function(d) {return d.Leccion+':'+d.Categoria_1;});

svgT.text("Nivel de completitud por lección del módulo "+ value2);
// Add title to graph
svgT.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Nivel de completitud por lección del módulo "+ value2);

//svgT.text("Nivel de completitud por lección del módulo "+ value2);

         
 svgT.append("g")
    .style("font-size", 10)
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 1 + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll(".tick text")
            .style("text-anchor", "middle")
            .call(wrap, x.bandwidth())
    .select(".domain").remove();

 svgT.append("g")
    .style("font-size", 10)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove();

//bars.style("opacity", 0.3);       

bars.enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Leccion) })
      .attr("y", function(d) { return y(d.Categoria_1) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth()- 80)
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 1)
     .on('mouseover', tipT.show)
      .on('mouseout' , tipT.hide);

bars.exit().remove();


//Add legend to graphs

var myColor = d3.scaleSequential()
    .interpolator(d3.interpolate("white", "steelblue"))
    .domain([1,100]);



var legend = svgT.selectAll(".legend")
      .data(myColor.ticks(6).slice(0))
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (500 + i * 50) + "," + (150) + ")"; });


  legend.append("rect")
      .attr("width", 50)
      .attr("height", 30)
      .style("stroke", "black")
      .style("fill", myColor);

  legend.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svgT.append("text")
      .attr("class", "label")
      .attr("x", width + 200)
      .attr("y", 1000)
      .attr("dy", ".35em")
      .text("Escala");






// Add subtitle to graph
svgT.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 1000)
        .text("Este gráfico presenta el porcentaje de completitud, por lección. Las lecciones con menor porcentaje, se presentan en color más claro.");



})
};







// Function for information bos

  /**
  * show the box on mouse over
  */
 function miFuncion() {
  var miTip = document.getElementById("miDiv").dataset.test;
  console.log(miTip);
}




//Function for second heatmap









//Function for second heatmap
