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
    departementDim,
    departementGroup,
    residenceDim,
    residenceGroup;

var donnees;

var residenceChart = dc.rowChart('#residenceChart');
var departementChart = dc.rowChart('#idpDepartement');

var stats;

var statTotIndividus = dc.numberDisplay('#statTotIndividus');
var statTotMenages = dc.numberDisplay('#statTotMenages');
var statTotHommes = dc.numberDisplay('#statTotHommes');
var statTotFemmes = dc.numberDisplay('#statTotFemmes');

var statTotVieux = dc.numberDisplay('#statTotVieux');
var statTotVieuxH = dc.numberDisplay('#statTotVieuxH');
var statTotVieuxF = dc.numberDisplay('#statTotVieuxF');

//var statPremierCycle = dc.numberDisplay();

var statTotPrimaire = dc.numberDisplay('#statTotPrimaire');
var statTotPrimaireH = dc.numberDisplay('#statTotPrimaireH');
var statTotPrimaireF = dc.numberDisplay('#statTotPrimaireF');

var statTotCollege = dc.numberDisplay('#statTotCollege');
var statTotCollegeH = dc.numberDisplay('#statTotCollegeH');
var statTotCollegeF = dc.numberDisplay('#statTotCollegeF');

var statTotLycee = dc.numberDisplay('#statTotLycee');
var statTotLyceeH = dc.numberDisplay('#statTotLyceeH');
var statTotLyceeF = dc.numberDisplay('#statTotLyceeF');

var statTotHandicap = dc.numberDisplay('#statTotHandicap');
var statTotFemmesEnceintes = dc.numberDisplay('#statTotFemmesEnceintes');
var statTotVeuves = dc.numberDisplay('#statTotVeuves');
var statTotMalades = dc.numberDisplay('#statTotMalades');
var statTotEnfantsSeuls = dc.numberDisplay('#statTotEnfantsSeuls');
var statTotOrphelins = dc.numberDisplay('#statTotOrphelins');


function instanciateData(data) {


    cf = crossfilter(data);

    departementDim = cf.dimension(function (d) {
        return d['Departement'];
    });

    residenceDim = cf.dimension(function (d) {
        return d['Site'];
    });

    departementGroup = departementDim.group().reduceSum(function (d) {
        return d["Total Individus"];
    });


    residenceGroup = residenceDim.group().reduceSum(function (d) {
        return d["Total Individus"];
    });


    stats = cf.groupAll().reduce(
        function (p, v) {
            p.totIndividus += +parseInt(v["Total Individus"]);
            p.totMenages += +parseInt(v["Total Menages"]);
            p.totHommes += +parseInt(v["Total Hommes"]);
            p.totFemmes += +parseInt(v["Total Femmes"]);

            p.totVieux += +parseInt(v["Total Vieux"]);
            p.totVieuxH += +parseInt(v["Vieux Hommes"]);
            p.totVieuxF += +parseInt(v["Vieux Femmes"]);

            p.totPrimaire += +parseInt(v["Total Primaire"]);
            p.totPrimaireH += +parseInt(v["Primaire Hommes"]);
            p.totPrimaireF += +parseInt(v["Primaire Femmes"]);

            p.totCollege += +parseInt(v["Total College"]);
            p.totCollegeH += +parseInt(v["College Hommes"]);
            p.totCollegeF += +parseInt(v["College Femmes"]);

            p.totLycee += +parseInt(v["Total Lycee"]);
            p.totLyceeH += +parseInt(v["Lycee Hommes"]);
            p.totLyceeF += +parseInt(v["Lycee Femmes"]);

            p.handicap += +v["Pers. avec handicape"];
            p.enceintes += +parseInt(v["Femme Enceinte"]);
            p.veuves += +parseInt(v["Veuves"]);
            p.orphelins += +parseInt(v["Orphelins"]);
            p.malades += +parseInt(v["Pers. Malades"]);
            p.seuls += +parseInt(v["Enfant non Acc."]);


            return p;
        },
        function (p, v) {
            p.totIndividus -= +parseInt(v["Total Individus"]);
            p.totMenages -= +parseInt(v["Total Menages"]);
            p.totHommes -= +parseInt(v["Total Hommes"]);
            p.totFemmes -= +parseInt(v["Total Femmes"]);

            p.totVieux -= +parseInt(v["Total Vieux"]);
            p.totVieuxH -= +parseInt(v["Vieux Hommes"]);
            p.totVieuxF -= +parseInt(v["Vieux Femmes"]);

            p.totPrimaire -= +parseInt(v["Total Primaire"]);
            p.totPrimaireH -= +parseInt(v["Primaire Hommes"]);
            p.totPrimaireF -= +parseInt(v["Primaire Femmes"]);

            p.totCollege -= +parseInt(v["Total College"]);
            p.totCollegeH -= +parseInt(v["College Hommes"]);
            p.totCollegeF -= +parseInt(v["College Femmes"]);

            p.totLycee -= +parseInt(v["Total Lycee"]);
            p.totLyceeH -= +parseInt(v["Lycee Hommes"]);
            p.totLyceeF -= +parseInt(v["Lycee Femmes"]);

            p.handicap -= +v["Pers. avec handicape"];
            p.enceintes -= +parseInt(v["Femme Enceinte"]);
            p.veuves -= +parseInt(v["Veuves"]);
            p.orphelins -= +parseInt(v["Orphelins"]);
            p.malades -= +parseInt(v["Pers. Malades"]);
            p.seuls -= +parseInt(v["Enfant non Acc."]);


            return p;
        },
        function () {
            return {
                totIndividus: 0,
                totMenages: 0,
                totHommes: 0,
                totFemmes: 0,
                totVieux: 0,
                totVieuxH: 0,
                totVieuxF: 0,
                totPrimaire: 0,
                totPrimaireH: 0,
                totPrimaireF: 0,
                totCollege: 0,
                totCollegeH: 0,
                totCollegeF: 0,
                totLycee: 0,
                totLyceeH: 0,
                totLyceeF: 0,
                handicap: 0,
                enceintes: 0,
                veuves: 0,
                orphelins: 0,
                malades: 0,
                seuls: 0
            };
        }
    );

}

function generateCharts(district) {

    instanciateData(donnees);
    //departementDim.filterAll();
    if (district == 'Pool') {
        district = '';
    }

    if (district == 'Niari') {
        district = '';
    }
    if (district != '') {
        departementDim.filter(district);
    }

    departementChart.width(350)
        .height(350)
        .dimension(departementDim)
        .group(departementGroup)
        .data(function (group) {
            return group.top(Infinity);
        })
        .colors(["#3b88c0"])
        .colorAccessor(function (d) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(4);

    residenceChart.width(350)
        .height(650)
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

    var totInd = function (d) {
        return d.totIndividus;
    };

    var totMen = function (d) {
        return d.totMenages;
    };

    var totH = function (d) {
        return d.totHommes;
    };

    var totF = function (d) {
        return d.totFemmes;
    };

    var totV = function (d) {
        return d.totVieux;
    };

    var totVH = function (d) {
        return d.totVieuxH;
    };

    var totVF = function (d) {
        return d.totVieuxF;
    };

    var totHandi = function (d) {
        return d.handicap;
    };

    var biir = function (d) {
        return d.enceintes;
    };

    var totP = function (d) {
        return d.totPrimaire;
    }

    var totPH = function (d) {
        return d.totPrimaireH;
    }
    var totPF = function (d) {
        return d.totPrimaireF;
    }

    var totC = function (d) {
        return d.totCollege;
    }

    var totCH = function (d) {
        return d.totCollegeH;
    }
    var totCF = function (d) {
        return d.totCollegeF;
    }

    var totL = function (d) {
        return d.totLycee;
    }

    var totLH = function (d) {
        return d.totLyceeH;
    }
    var totLF = function (d) {
        return d.totLyceeF;
    }

    var totVeuv = function (d) {
        return d.veuves;
    }

    var totOrphan = function (d) {
        return d.orphelins;
    }

    var totMalad = function (d) {
        return d.malades;
    }

    var totS = function (d) {
        return d.seuls;
    }

    statTotIndividus.group(stats)
        .valueAccessor(totInd)
        .formatNumber(formatDecimalComma);

    statTotMenages.group(stats)
        .valueAccessor(totMen)
        .formatNumber(formatDecimalComma);

    statTotHommes.group(stats)
        .valueAccessor(totH)
        .formatNumber(formatDecimalComma);

    statTotFemmes.group(stats)
        .valueAccessor(totF)
        .formatNumber(formatDecimalComma);

    //Primaire
    statTotPrimaire.group(stats)
        .valueAccessor(totP)
        .formatNumber(formatDecimalComma);

    statTotPrimaireH.group(stats)
        .valueAccessor(totPH)
        .formatNumber(formatDecimalComma);

    statTotPrimaireF.group(stats)
        .valueAccessor(totPF)
        .formatNumber(formatDecimalComma);



    //College
    statTotCollege.group(stats)
        .valueAccessor(totP)
        .formatNumber(formatDecimalComma);

    statTotCollegeH.group(stats)
        .valueAccessor(totCH)
        .formatNumber(formatDecimalComma);

    statTotCollegeF.group(stats)
        .valueAccessor(totCF)
        .formatNumber(formatDecimalComma);


    //Lycee
    statTotLycee.group(stats)
        .valueAccessor(totL)
        .formatNumber(formatDecimalComma);

    statTotLyceeH.group(stats)
        .valueAccessor(totLH)
        .formatNumber(formatDecimalComma);

    statTotLyceeF.group(stats)
        .valueAccessor(totLF)
        .formatNumber(formatDecimalComma);


    //Personnes agees
    statTotVieux.group(stats)
        .valueAccessor(totV)
        .formatNumber(formatDecimalComma);
    statTotVieuxH.group(stats)
        .valueAccessor(totVH)
        .formatNumber(formatDecimalComma);
    statTotVieuxF.group(stats)
        .valueAccessor(totVF)
        .formatNumber(formatDecimalComma);

    statTotHandicap.group(stats)
        .valueAccessor(totHandi)
        .formatNumber(formatDecimalComma);

    statTotFemmesEnceintes.group(stats)
        .valueAccessor(biir)
        .formatNumber(formatDecimalComma);

    statTotVeuves.group(stats)
        .valueAccessor(totVeuv)
        .formatNumber(formatDecimalComma);


    statTotMalades.group(stats)
        .valueAccessor(totMalad)
        .formatNumber(formatDecimalComma);


    statTotOrphelins.group(stats)
        .valueAccessor(totOrphan)
        .formatNumber(formatDecimalComma);


    statTotEnfantsSeuls.group(stats)
        .valueAccessor(totS)
        .formatNumber(formatDecimalComma);


    dc.renderAll();

}

var formatDecimalComma = d3.format(",.0f");


var mapsvg,
    centered;
var fillColor = '#F28C8C'; //'#dddddd'; //rgba(199,214,235,0.5)';//'#c7d6ee';
var hoverColor = '#3b88c0'; //'#f47933';
var inactiveFillColor = '#dddddd';

function generateMap(adm1) {

    $('.map-container').fadeIn();

    var width = $('#map').width();
    var height = 550;

    mapsvg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);

    //var mapscale = ($('body').width() < 1700) ? width * 4.7 : width * 2.7;
    var mapscale = 3600;
    var mapprojection = d3.geo.mercator()
        .center([14.3, -0.7]) //7/-0.742/14.326
        .scale(mapscale)
        .translate([width / 2, height / 2]);

    var g = mapsvg.append('g').attr('id', 'adm1layer');
    var path = g.selectAll('path')
        .data(adm1.features).enter()
        .append('path')
        .attr('d', d3.geo.path().projection(mapprojection))
        .attr('id', function (d) {
            return d.properties.admin1Name;
        })
        .attr('class', function (d) {
            var classname = (d.properties.admin1Name != '0') ? 'adm1' : 'inactive';
            return classname;
        })
        .attr('fill', function (d) {
            var clr = (d.properties.admin1Name != '0') ? fillColor : inactiveFillColor;
            var clr = (d.properties.admin1Name != '0') ? fillColor : inactiveFillColor;
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
                .html(d.properties.admin1Name)
        })
        .on('mouseout', function (d, i) {
            if (!$(this).data('selected'))
                $(this).attr('fill', fillColor);
            maptip.classed('hidden', true);
        })
        .on('click', function (d, i) {
            selectRegion($(this), d.properties.admin1Name);
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
    departementChart.filterAll();
    residenceChart.filterAll();
    generateCharts();
    return false;
}

var somCall = $.ajax({
    type: 'GET',
    url: 'data/cog_adm2.json',
    dataType: 'json',
});

var adm1Call = $.ajax({
    type: 'GET',
    url: 'data/som_adm1.json',
    dataType: 'json',
});



var idpCall = $.ajax({
    type: 'GET',
    url: 'data/idp.json',
    dataType: 'json',
});




$.when(idpCall).then(function (idpArgs) {
    donnees = idpArgs;
    generateCharts('');
})

$.when(adm1Call, somCall).then(function (adm1Args, somArgs) {
    //var adm1 = topojson.feature(adm1Args[0],adm1Args[0].objects.som_adm1);
    var som = topojson.feature(somArgs[0], somArgs[0].objects.cog_adm2);
    generateMap(som);
});
