            p.totPrimaire -= +parseInt(v["Total Primaire"]);
            p.totPrimaireH -= +parseInt(v["Primaire Hommes"]);
            p.totPrimaireF -= +parseInt(v["Primaire Femmes"]);

            p.totCollege -= +parseInt(v["Total College"]);
            p.totCollegeH -= +parseInt(v["College Hommes"]);
            p.totCollegeF -= +parseInt(v["College Femmes"]);

            function hxlProxyToJSON(input) {
                var output = [];
                var keys = [];
                input.forEach(function (e, i) {
                    if (i == 0) {
                        e.forEach(function (e2, i2) {
                            var parts = e2.split('+');
                            var key = parts[0]
                            if (parts.length > 1) {
                                var atts = parts.splice(1, parts.length);
                                atts.sort();
                                atts.forEach(function (att) {
                                    key += '+' + att
                                });
                            }
                            keys.push(key);
                        });
                    } else {
                        var row = {};
                        e.forEach(function (e2, i2) {
                            row[keys[i2]] = e2;
                        });
                        output.push(row);
                    }
                });
                return output;
            }

            var cf,
                districtDim,
                districtGroup,
                regionDim,
                regionGroup,
                provenanceDim,
                provenanceGroup,
                residenceDim,
                residenceGroup;

            var donnees;

            var provenanceChart = dc.rowChart('#provenance');
            var residenceChart = dc.rowChart('#residence');
            var departementChart = dc.rowChart('#idpDepartement');

            function instanciateData(data) {
                cf = crossfilter(data);

                districtDim = cf.dimension(function (d) {
                    return d.district;
                });
                regionDim = cf.dimension(function (d) {
                    return d.district;
                });
                provenanceDim = cf.dimension(function (d) {
                    return d.Provenance;
                });
                residenceDim = cf.dimension(function (d) {
                    return d.Residence;
                });

                regionGroup = regionDim.group().reduceSum(function (d) {
                    return d.IDP;
                });

                provenanceGroup = provenanceDim.group().reduceSum(function (d) {
                    return d.IDP;
                });
                residenceGroup = residenceDim.group().reduceSum(function (d) {
                    return d.IDP;
                });

                //generateCharts();
            }

            function generateCharts(district) {

                //instanciateData(donnees);
                districtDim.filterAll();

                if (district != '') {
                    districtDim.filter(district);
                }

                departementChart.width(350)
                    .height(400)
                    .dimension(regionDim)
                    .group(regionGroup)
                    .data(function (group) {
                        return group.top(Infinity);
                    })
                    .colors(["#3b88c0"])
                    .colorAccessor(function (d) {
                        return 0;
                    })
                    .elasticX(true)
                    .xAxis().ticks(4);

                provenanceChart.width(350)
                    .height(400)
                    .dimension(provenanceDim)
                    .group(provenanceGroup)
                    .data(function (group) {
                        return group.top(15);
                    })
                    .colors(["#3b88c0"])
                    .colorAccessor(function (d) {
                        return 0;
                    })
                    .elasticX(true)
                    .xAxis().ticks(4);

                residenceChart.width(350)
                    .height(400)
                    .dimension(residenceDim)
                    .group(residenceGroup)
                    .data(function (group) {
                        return group.top(15);
                    })
                    .colors(["#3b88c0"])
                    .colorAccessor(function (d) {
                        return 0;
                    })
                    .elasticX(true)
                    .xAxis().ticks(4);




                dc.renderAll();

            }


            var mapsvg,
                centered;
            var fillColor = '#dddddd'; //rgba(199,214,235,0.5)';//'#c7d6ee';
            var hoverColor = '#3b88c0'; //'#f47933';
            var inactiveFillColor = '#f2efe9';

            function generateMap(adm1, countrieslabel) {

                $('.map-container').fadeIn();

                var width = $('#map').width();
                var height = 400;

                mapsvg = d3.select('#map').append('svg')
                    .attr('width', width)
                    .attr('height', height);

                var mapscale = 9000; //($('body').width()<768) ? width*4.7 : width*2.7;
                var mapprojection = d3.geo.mercator()
                    .center([14.7, -3.9])
                    .scale(mapscale)
                    .translate([width / 2, height / 2]);

                var g = mapsvg.append('g').attr('id', 'adm1layer');
                var path = g.selectAll('path')
                    .data(adm1.features).enter()
                    .append('path')
                    .attr('d', d3.geo.path().projection(mapprojection))
                    .attr('id', function (d) {
                        return d.properties.NAME_2;
                    })
                    .attr('class', function (d) {
                        var classname = (d.properties.NAME_2 != '0') ? 'adm1' : 'inactive';
                        return classname;
                    })
                    .attr('fill', function (d) {
                        var clr = (d.properties.NAME_2 != '0') ? fillColor : inactiveFillColor;
                        return clr;
                    })
                    .attr('stroke-width', 1)
                    .attr('stroke', '#7d868d');

                //map tooltips
                var maptip = d3.select('#map').append('div').attr('class', 'd3-tip map-tip hidden');
                path.filter('.adm1')
                    .on('mousemove', function (d, i) {
                        $(this).attr('fill', hoverColor);
                        var mouse = d3.mouse(mapsvg.node()).map(function (d) {
                            return parseInt(d);
                        });
                        maptip
                            .classed('hidden', false)
                            .attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] + 20) + 'px')
                            .html(d.properties.NAME_2)
                    })
                    .on('mouseout', function (d, i) {
                        if (!$(this).data('selected'))
                            $(this).attr('fill', fillColor);
                        maptip.classed('hidden', true);
                    })
                    .on('click', function (d, i) {
                        selectRegion($(this), d.properties.NAME_2);
                    });

                //create countrylabels
                var country = g.selectAll('text')
                    .data(countrieslabel).enter()
                    .append('text')
                    .attr('class', 'countryLabel')
                    .attr("transform", function (d) {
                        return "translate(" + mapprojection([d.coordinates[0], d.coordinates[1]]) + ")";
                    })
                    .text(function (d) {
                        return d.country;
                    });


                $('.reset-btn').on('click', reset);
            }



            function selectRegion(region, name) {
                region.siblings().data('selected', false);
                region.siblings('.adm1').attr('fill', fillColor);
                region.attr('fill', hoverColor);
                region.data('selected', true);
                $('.regionLabel > div > strong').html(name);
                generateCharts(name);
            }

            function reset() {
                $('#adm1layer').children('.adm1').attr('fill', fillColor);
                $('.regionLabel > div > strong').html('All Regions');
                generateCharts('');
                return false;
            }

            var somCall = $.ajax({
                type: 'GET',
                url: 'data/cog-adm2.json',
                dataType: 'json',
            });

            var adm1Call = $.ajax({
                type: 'GET',
                url: 'data/som_adm1.json',
                dataType: 'json',
            });

            var countrieslabelCall = $.ajax({
                type: 'GET',
                url: 'data/countries.json',
                dataType: 'json',
            });

            var idpCall = $.ajax({
                type: 'GET',
                url: 'data/idp.json',
                dataType: 'json',
            });




            $.when(idpCall).then(function (idpArgs) {
                donnees = idpArgs;
                generateCharts(idpArgs);
            })

            $.when(adm1Call, somCall, countrieslabelCall).then(function (adm1Args, somArgs, countrieslabelArgs) {
                //var adm1 = topojson.feature(adm1Args[0],adm1Args[0].objects.som_adm1);
                var som = topojson.feature(somArgs[0], somArgs[0].objects.congo_adm2);
                var countrieslabel = countrieslabelArgs[0].countries;
                generateMap(som, countrieslabel);
            });
