/* global d3 */
/*
  Taken from https://bl.ocks.org/bricedev/8aaef92e64007f882267
*/

function radialGraph(hero, format, className) {
  const width = 300;
  const height = 300;
  const barHeight = (height / 2) - 40;

  const formatNumber = d3.format(format);

  const color = d3.scale.ordinal()
    .range(['#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']);

  const svg = d3.select(className).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const extent = d3.extent(hero, d => d.value);
  const barScale = d3.scale.linear()
    .domain(extent)
    .range([0, barHeight]);

  const keys = hero.map((d, i) => d.name);
  const numBars = keys.length;

  const x = d3.scale.linear()
    .domain(extent)
    .range([0, -barHeight]);

  const xAxis = d3.svg.axis()
    .scale(x).orient('left')
    .ticks(3)
    .tickFormat(formatNumber);

  const circles = svg.selectAll('circle')
    .data(x.ticks(3))
    .enter().append('circle')
    .attr('r', d => barScale(d))
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-dasharray', '2,2')
    .style('stroke-width', '.5px');

  const arc = d3.svg.arc()
    .startAngle((d, i) => (i * 2 * Math.PI) / numBars)
    .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / numBars)
    .innerRadius(0);

  const segments = svg.selectAll('path')
    .data(hero)
    .enter().append('path')
    .each((d) => { d.outerRadius = 0; })
    .style('fill', d => color(d.name))
    .attr('d', arc);

  segments.transition().ease('elastic').duration(1000).delay((d, i) => (25 - i) * 100)
    .attrTween('d', (d, index) => {
      const i = d3.interpolate(d.outerRadius, barScale(+d.value));
      return (t) => { d.outerRadius = i(t); return arc(d, index); };
    });

  svg.append('circle')
    .attr('r', barHeight)
    .classed('outer', true)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '1.5px');

  svg.selectAll('line')
    .data(keys)
    .enter().append('line')
    .attr('y2', -barHeight - 20)
    .style('stroke', 'grey')
    .style('stroke-width', '.5px')
    .attr('transform', (d, i) => `rotate(${(i * 360) / numBars})`);

  svg.append('g')
    .attr('class', 'x axis')
    .call(xAxis);

  // Labels
  const labelRadius = barHeight * 1.025;

  const labels = svg.append('g')
    .classed('labels', true);

  labels.append('def')
    .append('path')
    .attr('id', 'label-path')
    .attr('d', `m0 ${-labelRadius} a${labelRadius} ${labelRadius} 0 1,1 -0.01 0`);

  labels.selectAll('text')
    .data(keys)
    .enter().append('text')
    .style('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .style('fill', (d, i) => '#3e3e3e')
    .append('textPath')
    .attr('xlink:href', '#label-path')
    .attr('startOffset', (d, i) => `${((i * 100) / numBars) + (50 / numBars)}%`)
    .text(d => d.toUpperCase());
}

function graphUser(hero) {

  d3.select('svg').remove();
  
  let total = 0;

  hero.forEach((stat) => {
    total += stat.value;
  });

  const heroRelative = [];

  hero.forEach((stat) => {
    heroRelative.push({
      name: stat.name,
      value: stat.value / total,
    });
  });

  radialGraph(heroRelative, '%', '.d3GraphRelative');
}
