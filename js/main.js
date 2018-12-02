/* global d3, crossfilter, timeSeriesChart, barChart */

var barChartPartModulo=barChart()
  .width(800)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});

var barChartPartLeccion=barChart()
.x(function (d) { return d.key;})
.y(function (d) { return d.value;})


var barChartPartActividad=barChart()
.x(function (d) { return d.key;})
.y(function (d) { return d.value;});




d3.csv("data/dataset.csv", function(d){

  d.part_modulo=+d['part_modulo']
  d.part_leccion= +d["part_leccion"]
  d.part_item = +d["part_item"]
  d.prom_intentos= +d['prom_intentos']
  d.prom_act_aprendizaje= +d['prom_intentos']
  d.completitud_modulo  = +["completitud_modulo"]
  d.completitud_lec = +d["completitud_lec"]
    
  return d;

},function (err, data) {

if (err) throw err;

// handle on click event for dropdown
d3.select("#d3-dropdown")
  .on('change', function() {
    var newValue = eval(d3.select(this).property('value'));
    

    var data_filter = data.filter(function (d) {
        return d.type_est === newValue;         
    });

    console.log(data_filter)



var csData = crossfilter(data_filter);

csData.dimPartModulo = csData.dimension(function (d) { return d.modulo; });
csData.partModulo = csData.dimPartModulo.group()


var reducer = reductio()
    .exception(function(d) { return d.modulo; })
    .exceptionSum(function(d) { return d.part_modulo; });

reducer(csData.partModulo);

csData.partModulo.top(Infinity);

csData.dimPartLeccion = csData.dimension(function (d) { return d["course_branch_lesson_name"]; });
csData.partLeccion = csData.dimPartLeccion.group();

csData.dimPartActividad = csData.dimension(function (d) { return d["item"]; });
csData.partActividad = csData.dimPartActividad.group();


barChartPartModulo.onclick(function (d) {

      console.log("hizo click en modulo")
      
      csData.dimPartModulo.filter(d.key);
      barChartPartLeccion.x(function(d){if(d.value!=0){return d.key}})

      var reducer1 = reductio()
      .exception(function(d) { return d.course_branch_lesson_name; })
      .exceptionSum(function(d) { return d.part_leccion });

      reducer1(csData.partLeccion);

      csData.partLeccion.top(Infinity);



      update1();
    })

barChartPartLeccion.onclick(function (d) {

        console.log("hizo click  en leccion")


        csData.dimPartLeccion.filter(d.key);
        barChartPartActividad.x(function(d){if(d.value!=0){return d.key}})


      var reducer2 = reductio()
      .exception(function(d) { return d.item; })
      .exceptionSum(function(d) { return d.part_item });

      reducer2(csData.partActividad);

      csData.partActividad.top(Infinity);


        update2();
  });

    function update() {
        d3.select("#partModulo")
        .datum(csData.partModulo.all().map(function(d){ 
          return {key:d.key,value:d.value.exceptionSum}
        }))
        .call(barChartPartModulo);
        //.attr("transform", "translate(-8,-1) rotate(-45)"); 
    } 
    function update1() {
        d3.select("#partLeccion")
        .datum(csData.partLeccion.all().map(function(d){ 
          return {key:d.key,value:d.value.exceptionSum}
        }))
        .call(barChartPartLeccion)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text");
        //.attr("transform", "translate(-8,-1) rotate(-45)");
    } 
    function update2() {
        d3.select("#partActividad")
        .datum(csData.partActividad.all().map(function(d){ 
          return {key:d.key,value:d.value.exceptionSum}
        }))
        .call(barChartPartActividad)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text");
        //.attr("transform", "translate(-8,-1) rotate(-45)");
    } 


  update();  



});
})