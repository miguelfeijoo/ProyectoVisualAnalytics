/* global d3 */

function barChart() {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400,
    height = 400,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.scaleBand().padding(0.1),
    yScale = d3.scaleLinear(),
    onMouseOver = function () { },
    onMouseOut = function () { },
    onclick = function () { },
    ondblclick = function () { };

  function chart(selection) {
    selection.each(function (data) {

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append("svg");
      var gEnter = svgEnter.append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom,

      // Update the outer dimensions.
      svg.merge(svgEnter).attr("width", width)
        .attr("height", height);

      // Update the inner dimensions.
      var g = svg.merge(svgEnter).select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xScale.rangeRound([0, innerWidth])
        .domain(data.map(xValue));
      yScale.rangeRound([innerHeight, 0])
        .domain([0, d3.max(data, yValue)]);

      g.select(".x.axis")
          .attr("transform", "translate(0," + innerHeight + ")")
          .call(d3.axisBottom(xScale))
          .selectAll(".tick text")
            .style("text-anchor", "middle")
            .call(wrap, xScale.bandwidth());

      g.select(".y.axis")
          .call(d3.axisLeft(yScale).ticks(10))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .style("visibility","visible")
      .offset([-20, 0])
      .html(function(d) {
      return "<span style='color:white'>'" + d.key + "' " +    "</span><span style='color:black'>   <===>   " + "</span> <span style='color:darkblue'>   Valor registrado: " + d.value + "</span>";
      })
      svgT.call(tip);

      var bars = g.selectAll(".bar")
        .data(function (d) { return d; });

      bars.enter().append("rect")
          .attr("class", "bar")
        .merge(bars)
          .attr("x", X)
          .attr("y", Y)
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return innerHeight - Y(d); })
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .on("click", onclick)
          .on("dblclick", ondblclick);

      bars.exit().remove();
    });

  }

  //Funcion que centra .tick 
  function wrap(text, width) {
    //console.log(text)
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

// The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.onMouseOver = function(_) {
    if (!arguments.length) return onMouseOver;
    onMouseOver = _;
    return chart;
  };

  chart.onMouseOut = function(_) {
    if (!arguments.length) return onMouseOut;
    onMouseOut = _;
    return chart;
  };


  chart.onclick = function(_) {
    if (!arguments.length) return onclick;
    onclick = _;
    return chart;
  };

  chart.ondblclick = function(_) {
    if (!arguments.length) return ondblclick;
    ondblclick = _;
    return chart;
  };


  return chart;
}



