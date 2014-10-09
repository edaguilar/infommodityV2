var urlBase = 'http://app.infommodity.com/Infommodity.svc/';

/* LOGIN */
 function tokenHandler(result) {
            window.localStorage.setItem("pushID", result);
        }
		function successHandler(result) {
            //alert('Callback Success! Result = '+result)
        }

        function errorHandler(error) {
            alert(error);
        }

function iniciarSesion() {
	
    console.log("Hola Mundo!");
    var usuario = $("#txtUsuario").val();
    var contrasena = $("#txtPassword").val();
	

    var url = urlBase + "AutentificarUsuario";
    var params = JSON.stringify({
        correo : usuario,
        clave : contrasena,
        idDispositivo: "ED",
        dispositivo: device.platform,
        poshToken: "00"
    });
    console.log(params);
    //$.support.cors = true;
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var resultado = JSON.parse(t.AutentificarUsuarioResult);
            var idUsuario = resultado.idUsuario;
            if (idUsuario != 0){
                window.localStorage.setItem("idUsuario",idUsuario);
                window.location.replace("menu.html");
            } else {
               alert(resultado.mensaje);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });


}

/* END LOGIN */

/* MENU */

function cargarMenuPrincipal() {
    var dataSource = new kendo.data.DataSource({
        data: [
            { Titulo: 'Documentos', orden: 0, ImgUrl:'icono_documentos.png', Url:'documentos.html'},
            { Titulo: 'Variables', orden: 1, ImgUrl:'icono_variables.png', Url:'variables.html'},
            { Titulo: 'Analisis Diario', orden: 2, ImgUrl:'icono_analisis_diario.png', Url:'analisis-diario.html'},
            { Titulo: 'Notificaciones', orden: 3, ImgUrl:'icono_notificarme.png', Url:'notificaciones.html'},
            { Titulo: 'Precios Físicos', orden: 4, ImgUrl:'icono_bases.png', Url:'bases.html'}
        ]
    });

    $("#listview").kendoMobileListView({
        dataSource: dataSource,
        template: $("#listview-template").text(),
        click: function(e) {
            window.location = e.dataItem.Url;
        }
    })
}

function goBack() {
    window.history.back();
}

function goMenu() {
    window.location.replace("menu.html");
}
/* END MENU */

/* DOCUMENTOS */

function cargarDocumentos(){

    cargando();
    var url = urlBase + "ObtenDocumentos";

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenDocumentosResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);


            terminoCargando();
            if (resultado.length > 1) {
                var dataSource = new kendo.data.DataSource({
                    data: resultado
                });

                $("#listview").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#listview-template").text(),
                    click: function(e) {
                        //window.location = "descargar.html?url=" + encodeURI(e.dataItem.ruta);
                        window.open(e.dataItem.ruta);
                    }
                });
            }
            else {
                alert("No hay documentos registrados para el día de hoy.");
            }
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });



}


/* END DOCUMENTOS */

function cargarDescargar() {

//    var altoTotal = $("#view").height();
//    var iframe = $("#pdfRenderer");
//    iframe.height(altoTotal - 80);
//
//    var urlPdf = window.location.search.substring(1).replace("url=","");
//
//    iframe.attr("data",urlPdf);
//
//    console.log(urlPdf);
//    var variablename = new PDFObject({ url: urlPdf }).embed("pdfRenderer");
//    alert(variablename);
//    console.log(variablename);
//   // console.log(window.location.search.substring(1).replace("url=",""));
    //iframe.attr("src","http://docs.google.com/gview?url=" + window.location.search.substring(1).replace("url=","") + "&embedded=true");
    //iframe.attr("src",window.location.search.substring(1).replace("url=",""));

//    var renderer = $("#pdfRenderer");
//    renderer.height(altoTotal - 80);
//
//    var pdf = new PDFObject({
//        url: window.location.search.substring(1).replace("url=",""),
//        id: "pdfRendered",
//        pdfOpenParams: {
//            view: "FitH"
//        }
//    }).embed("pdfRenderer");
}

/* VARIABLES */

function cargarVarCommodity() {
    variablesCommodityActivo = true;
    variablesVariablesActivo = false;
    variablesAnalisisActivo = false;
    variablesTablaActivo = false;

    if (!yaCargoCommodity){
        obtenerCommodities();
    }
    cambiarColorFondoTabs();
    cambiarEstiloHeaderParaTabla(false);
}

function obtenerCommodities() {
    cargando();
    var url = urlBase + "ObtenListadoNombresCommodities";

    var params = JSON.stringify({
        seccion : 'Variables'
    });
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenListadoNombresCommoditiesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);

            //console.log(docs);
            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            $("#listview-commodity").kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template").text(),
                click: function(e) {
                    window.sessionStorage.setItem("idCommodity", e.dataItem.idCommodity);
                    window.sessionStorage.removeItem("variable");
                    seleccionarCommodity();
                    cargarValoresDeVariables(e.dataItem.idCommodity);
                }
            });

            //Selecciona el primero
            if (window.sessionStorage.getItem("idCommodity") == null)
                window.sessionStorage.setItem("idCommodity",1);
            seleccionarCommodity();
            yaCargoCommodity = true;

            cargarValoresDeVariables(1);
            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function seleccionarCommodity(){
    var idVariable =  window.sessionStorage.getItem("idCommodity");

    $("#listview-commodity").find("div[class='renglonVariable']").each(function(index){
        var idActual = $(this).find("input[type='hidden']").val();
        var img = $(this).find("img");
        if (idActual == idVariable)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function seleccionarCommodityBase(){

    var idVariable =  window.sessionStorage.getItem("idBasesCommodity");
	
    $("#listview-commodity").find("div[class='renglonVariable']").each(function(index){
        var idActual = $(this).find("input[type='hidden']").val();
        var img = $(this).find("img");
        if (idActual == idVariable)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function seleccionarTipoBase(){
    var idVariable =  window.sessionStorage.getItem("idTipoBase");

    $("#listview-base").find("div[class='renglonVariable']").each(function(index){
        var idActual = $(this).find("input[type='hidden']").val();
        var img = $(this).find("img");
        if (idActual == idVariable)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function seleccionarUnidadBase(){
    var idVariable =  window.sessionStorage.getItem("idUnidad");

    $("#listview-unidad").find("div[class='renglonVariable']").each(function(index){
        var idActual = $(this).find("input[type='hidden']").val();
        var img = $(this).find("img");
        if (idActual == idVariable)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function cargarValoresDeVariables(idCommodity){

    cargando();
    var url = urlBase + "ObtenListadoVariables";

    var params = JSON.stringify({
        idCommodity : idCommodity
    });
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenListadoVariablesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);

            //console.log(docs);

            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            var listViewHtml = $("#listview-variables");
            if (yaCargoVariables){
                listViewHtml.data("kendoMobileListView").destroy();
            }

            listViewHtml.kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template-variable").text(),
                click: function (e) {
                    window.sessionStorage.setItem("variable", e.dataItem.variable);
                    seleccionarVariable();
                }
            });

            //Selecciona el primero
            if (window.sessionStorage.getItem("variable") == null)
                window.sessionStorage.setItem("variable", resultado[0].variable);
            seleccionarVariable();
            yaCargoVariables = true;
            terminoCargando();

        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function cargarVarVariables() {
    variablesCommodityActivo = false;
    variablesVariablesActivo = true;
    variablesAnalisisActivo = false;
    variablesTablaActivo = false;

    cambiarEstiloHeaderParaTabla(false);
    cambiarColorFondoTabs();

    if (!yaCargoCommodity){
        obtenerCommodities();
    }
}

function seleccionarVariable(){
    var variable =  window.sessionStorage.getItem("variable");

    $("#listview-variables").find("div[class='renglonVariable']").each(function(index){
        var actual = $(this).find("input[type='hidden']").val();
        var img = $(this).find("img");
        if (actual == variable)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function cargarVarAnalisis() {
    cargando();
    variablesCommodityActivo = false;
    variablesVariablesActivo = false;
    variablesAnalisisActivo = true;
    variablesTablaActivo = false;

    var idCommodity = window.sessionStorage.getItem("idCommodity");
    var variable = window.sessionStorage.getItem("variable");

    var url = urlBase + "ObtenListadoAnalisisVariables";
    var params = JSON.stringify({
        idCommodity : idCommodity,
        variable: variable
    });
    //console.log(params);

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            //console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var resultado = t.ObtenListadoAnalisisVariablesResult;

            //console.log(resultado);
            var analisis = JSON.parse(resultado).analisis;
			//console.log(analisis);
            if (analisis != null && analisis.length > 2)
                $("#contenidoAnalisis").text(analisis);
            else
                $("#contenidoAnalisis").text("No disponible por el momento");

            var headerFecha = $("#fechaAnalisis");
            var txtFecha = $(".txtFecha");


            cambiarHeaderAnalisisDiario(idCommodity);
            terminoCargando();

        },
        error: function (e) {
            console.log(e);
            $("#contenidoAnalisis").text("No disponible por el momento");
            terminoCargando();
        }
    });



    yaCargoAnalisis = true;


    cambiarEstiloHeaderParaTabla(false);
    cambiarColorFondoTabs();
}

function cargarVarTabla() {
    cargando();
    variablesCommodityActivo = false;
    variablesVariablesActivo = false;
    variablesAnalisisActivo = false;
    variablesTablaActivo = true;

    var idCommodity = window.sessionStorage.getItem("idCommodity");
    var variable = window.sessionStorage.getItem("variable");

    var url = urlBase + "ObtenListadoTablaVariables";
    var params = JSON.stringify({
        idCommodity : idCommodity,
        variable: variable
    });
    //console.log(params);
    //$.support.cors = true;
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            //console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var renglones = "[" + t.ObtenListadoTablaVariablesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(renglones);
            //console.log(resultado);

            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            $("#listview-tabla").kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template-tabla").text()
            });
            window.sessionStorage.setItem("idTabla",0);

			for(var i = 0; i < dataSource._total; i++){
				dataSource.data()[i].v1 = addCommas(dataSource.data()[i].v1);
				dataSource.data()[i].v2 = addCommas(dataSource.data()[i].v2);
				dataSource.data()[i].v3 = addCommas(dataSource.data()[i].v3);
				dataSource.data()[i].v4 = addCommas(dataSource.data()[i].v4);
				dataSource.data()[i].v5 = addCommas(dataSource.data()[i].v5);
				dataSource.data()[i].v6 = addCommas(dataSource.data()[i].v6);
			}
			
            //Recorre todos para ver cuantos renglones
            dataSource.fetch();
            var dataSourceData = dataSource.data();

            for (var i = 0; i < dataSourceData.length; i++){
                var dataItem = dataSourceData[i];				
					
                //Si es de dos renglones
                if (dataItem.h5.length == 0){
                    var renglonTabla = $("#renglonTabla_" + i);
                    renglonTabla.removeAttr("class");
                    renglonTabla.attr("class","divTabla2");
                    $("#tablaVariables_" + i).css("height","75%");
                    $("#ultimaFila_" +  + i).remove();
                }
            }

            var titulo = $("span[data-role='view-title']");
            if (idCommodity == 11 || idCommodity == 10)//Petroleo o Gas
                titulo.text("Fuente: " + "EIA");
            else
                titulo.text("Fuente: " + "US Department of Agriculture");

            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });

    cambiarEstiloHeaderParaTabla(true);
    cambiarColorFondoTabs();
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function cambiarEstiloHeaderParaTabla(agregar){
    var titulo = $("span[data-role='view-title']");
    if (agregar){
        titulo.css("text-align","left");
        titulo.css("float","left");
        titulo.css("padding-left","5px");
        titulo.css("font-size","0.8em");
    }
    else {

        titulo.css("text-align","");
        titulo.css("float","");
        titulo.css("padding-left","");
        titulo.css("font-size","");
    }
}

function obtenerColor(status) {
    switch (status){
        case "abajo": return "rojo";
        case "arriba": return "verde";
        case "igual": return "negro";
        case "subebaja": return "gris";
    }
}

function irAGrafica(idVariable,renglonVariable){

    window.sessionStorage.setItem("idVariable",idVariable);
    window.sessionStorage.setItem("renglonVariable",renglonVariable);
    window.location = "grafica.html";
}

function cambiarColorFondoTabs(){
    if (variablesCommodityActivo)
        $(".km-root .km-pane .km-view .km-commodity").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-commodity").css("background-color","#000");
    if (variablesVariablesActivo)
        $(".km-root .km-pane .km-view .km-variables").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-variables").css("background-color","#000");
    if (variablesAnalisisActivo)
        $(".km-root .km-pane .km-view .km-analisis").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-analisis").css("background-color","#000");
    if (variablesTablaActivo)
        $(".km-root .km-pane .km-view .km-tabla").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-tabla").css("background-color","#000");
    if (variableBaseActivo)
        $(".km-root .km-pane .km-view .km-base").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-base").css("background-color","#000");
    if (variablesUnidadActivo)
        $(".km-root .km-pane .km-view .km-unidad").css("background-color","#fff");
    else
        $(".km-root .km-pane .km-view .km-unidad").css("background-color","#000");

}

var nombresDeMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var variablesCommodityActivo = true;
var variablesVariablesActivo = true;
var variablesAnalisisActivo = true;
var variablesTablaActivo = true;
var yaCargoCommodity = false;
var yaCargoVariables = false;
var yaCargoAnalisis = false;
var yaCargoTabla = false;
var variableBaseActivo  = true;
var variablesUnidadActivo = true;
/* END VARIABLES */

/* GRAFICA */

function graficar() {
    cargando();
    var container = $("#container");
	
    var idCommodity = window.sessionStorage.getItem("idCommodity");
    var variable = window.sessionStorage.getItem("variable");
    var idVariable = window.sessionStorage.getItem("idVariable");
    var renglonVariable = window.sessionStorage.getItem("renglonVariable");

    var alto = $(window).height()-80;
    var ancho = $(window).width()-20;

    container.css("min-width",ancho);
    container.css("height",alto);
    $("#divTitulo").text(renglonVariable);

    var url = urlBase + "ObtenGrafica";
    var params = JSON.stringify({
        idCommodity : parseInt(idCommodity),
        renglonVariable : renglonVariable,
        idVariable: parseInt(idVariable)
    });

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var renglones = "[" + t.ObtenGraficaResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(renglones);
            //console.log(renglones);

            //Separar por serie
            var seriesTitulos = [];
            var categorias = [];
            var series = [];
            var numeroDeValores = 0;
            var ordenSerie = 20;
            $.each(resultado,function(i,obj){
				if(obj.encabezado.search(' AM') > 0 || obj.encabezado.search(' PM') > 0)
                var encabezado = obj.encabezado.substring(0,obj.encabezado.indexOf(' '))
				else
				var encabezado = obj.encabezado;
                var serie = obj.serie;
                var valor = obj.valor;

                //Categorias
                if ($.inArray(encabezado,categorias) == -1)
                    categorias.push(encabezado);

                //Series

                if($.inArray(serie,seriesTitulos) == -1){
                    seriesTitulos.push(serie);
                    series.push({ name: serie, data:[] });
                    ordenSerie--;
                }
                var idSerie = $.inArray(serie,seriesTitulos);

                //Valores
                series[idSerie].data.push(parseFloat(valor));
                numeroDeValores++;
            });

            $.each(series,function(i,obj){
                $.each(obj.data,function(j,d){
                    if (d.toString() == 'NaN')
                        series[i].data[j] = null
                });
            });

            console.log(series);
            //Establece el ancho
            var altoDeLaGrafica = 60 * (numeroDeValores / 10);

            var altoAux = alto;
            if (alto < altoDeLaGrafica) {
                container.css("height",altoDeLaGrafica);
                altoAux = altoDeLaGrafica;
            }
			
			container.css("margin-top", "0");
			container.css("margin-bottom", "0");
			container.css("margin-left", "auto");
			container.css("margin-right", "auto");
            //container.css("width",ancho);

            var titulo = "";

            $(function () {
                $('#container').highcharts({/**/
                chart: {
                    type: 'line',
                    inverted: true,
                    spacingRight: 50		
                },
                    title: {
                        text: ' ',
                        align: 'top'
                    },
                    legend: {
                        align:'top',
                        verticalAlign:'top',
                        margin:10,					
                        reversed: true,
                        width:380,
						itemStyle: {
							fontSize: '8px'
						}
                    },

                    xAxis: {
                        categories: categorias,
                        labels: {
                            rotation: +45,
                            align: 'right',
                            style: {
                                fontSize: '8px'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: titulo
                        },
                        labels: {
							rotation: 90,
                            align: 'right',
                            style: {
                                fontSize: '8px'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.value, 0, '.', ',')
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series:
                        series

                });
				
				var legenda = document.children[0].children[1].children[0].children[1].children[1].children[0].children[0].children[0].children[9];
				legenda.setAttribute("transform", "translate(".concat(($(window).height()-260).toString()).concat(",10),rotate(90)"));							
            });
			
            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });


}
/* END GRAFICA */

/* Análisis diario */

var yaCargoCommodityAnalisisDiario = false;
function cargarAnalisisCommodity() {


    //window.sessionStorage.setItem("idCommodity", 0);
    //seleccionarCommodity();

    if (!yaCargoCommodityAnalisisDiario){

        cargando();
        var url = urlBase + "ObtenListadoNombresCommodities";

        var params = JSON.stringify({
            seccion : 'Analisis Diario'
        });
        $.ajax({
            url: url,
            crossDomain: true,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=uft-8",
            data: params,
            success: function (e) {
                var t = JSON.parse(JSON.stringify(e));
                var docs = "[" + t.ObtenListadoNombresCommoditiesResult.replace(/}{/g,"},{") + "]";
                var resultado = JSON.parse(docs);

                //console.log(docs);
                var dataSource = new kendo.data.DataSource({
                    data: resultado
                });

                $("#listview-commodity").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#listview-template").text(),
                    click: function(e) {
                        window.sessionStorage.setItem("idCommodity", e.dataItem.idCommodity);
                        seleccionarCommodity();
                        window.kendoMobileApplication.navigate("view-analisis-diario");
                    }
                });

                yaCargoCommodityAnalisisDiario = true;
                terminoCargando();
            },
            error: function (e) {
                console.log(e);
                terminoCargando();
            }
        });
    }
}

function cargarAnalisisDiario(){

    cargando();
    var idCommodity = window.sessionStorage.getItem("idCommodity");

    var url = urlBase + "ObtenAnalisisDiario";
    var params = JSON.stringify({
        idCommodity : idCommodity
    });

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {

            var t = JSON.parse(JSON.stringify(e));
            var resultado = t.ObtenAnalisisDiarioResult;


            var analisis = JSON.parse(resultado).analisis;
            if (analisis != null && analisis.length > 0)
                $("#contenidoAnalisis").text(analisis);
            else
                $("#contenidoAnalisis").text("No disponible por el momento");

            cambiarHeaderAnalisisDiario(idCommodity);

            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            $("#contenidoAnalisis").text("No disponible por el momento");
            terminoCargando();
        }
    });

}

function cambiarHeaderAnalisisDiario(idCommodity) {
    var headerFecha = $("#fechaAnalisis");
    var txtFecha = $(".txtFecha");

    var date = new Date();
    var fecha = (date.getDate()) + " " + nombresDeMeses[date.getMonth()] + " " + date.getFullYear();
    txtFecha.text(fecha);
    if (idCommodity == 1) //Maiz
        headerFecha.attr("class", "fondoMaiz");
    else if (idCommodity == 2) //Trigo
        headerFecha.attr("class", "fondoTrigo");
    else if (idCommodity == 3) //Soya
        headerFecha.attr("class", "fondoSoya");
    else if (idCommodity == 4) //Arroz
        headerFecha.attr("class", "fondoArroz");
    else if (idCommodity == 5) //Algodon
        headerFecha.attr("class", "fondoAlgodon");
    else if (idCommodity == 6) //Sorgo
        headerFecha.attr("class", "fondoSorgo");
    else if (idCommodity == 10) //Gas
        headerFecha.attr("class", "fondoGas");
    else if (idCommodity == 11) //Petróleo
        headerFecha.attr("class", "fondoPetroleo");
    else if (idCommodity == 12) //Pasta de Soya
        headerFecha.attr("class", "fondoPastaSoya");
    else if (idCommodity == 13) //Cerdo
        headerFecha.attr("class", "fondoCerdo");
    else if (idCommodity == 14) //Res
        headerFecha.attr("class", "fondoRes");
    else if (idCommodity == 15) //Pollo
        headerFecha.attr("class", "fondoPollo");
    else if (idCommodity == 16) //Azucar
        headerFecha.attr("class", "fondoAzucar");
    else if (idCommodity == 17) //Leche
        headerFecha.attr("class", "fondoLeche");
}
/* End Análisis Diario */

/* BASES  */
var yaCargoBasesCommodity = false;
function cargarBasesCommodity() {

    variablesCommodityActivo = true;
    variableBaseActivo = false;
    variablesUnidadActivo = false;
    variablesTablaActivo = false;

    if (!yaCargoBasesCommodity){
        obtenerBasesCommodity();
    }
    cambiarColorFondoTabs();
    cambiarEstiloHeaderParaTabla(false);
}

function obtenerBasesCommodity()
{
    cargando();
    var url = urlBase + "ObtenerCommoditiesBases";

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenerCommoditiesBasesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);

            //console.log(docs);
            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            $("#listview-commodity").kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template").text(),
                click: function(e) {
                    window.sessionStorage.setItem("idBasesCommodity", e.dataItem.idCommodity);
                    window.sessionStorage.removeItem("idTipoBase");
                    window.sessionStorage.removeItem("idUnidad");
                    seleccionarCommodityBase();
                    obtenerTipoBase();
                    obtenerUnidad();
                }
            });

            //Selecciona el primero
            if (window.sessionStorage.getItem("idBasesCommodity") == null)
                window.sessionStorage.setItem("idBasesCommodity",resultado[0].idCommodity);
            seleccionarCommodityBase();
            yaCargoBasesCommodity = true;
            terminoCargando();

            obtenerTipoBase();
            obtenerUnidad();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function obtenerTipoBase() {

    cargando();
    var url = urlBase + "ObtenerTipoBases";

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenerTipoBasesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);

            //console.log(docs);
            var dataSource = new kendo.data.DataSource({
                data: resultado
            });
			console.log(resultado);
            $("#listview-base").kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template-tipo").text(),
                click: function(e) {
				console.log(e);
                    if(e.dataItem != undefined){
                    window.sessionStorage.setItem("idTipoBase", e.dataItem.idTipo);
                    window.sessionStorage.setItem("tipoBase", e.dataItem.tipo);
					}
                    seleccionarTipoBase();
                }
            });

            //Selecciona el primero
            if (window.sessionStorage.getItem("idTipoBase") == null) {
                window.sessionStorage.setItem("idTipoBase",resultado[0].idTipo);
                window.sessionStorage.setItem("tipoBase", resultado[0].tipo);
            }
            seleccionarTipoBase();
            yaCargoBasesCommodity = true;

            //cargarValoresDeVariables(1);
            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function obtenerUnidad() {

    cargando();
    var url = urlBase + "ObtenerUnidadesBases";

    var idCommodity =  window.sessionStorage.getItem("idBasesCommodity");
    var params = JSON.stringify({
        idCommodity : idCommodity
    });

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            var t = JSON.parse(JSON.stringify(e));
            var docs = "[" + t.ObtenerUnidadesBasesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(docs);

            //console.log(docs);
            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            var listViewHtml = $("#listview-unidad");
            if (yaCargoUnidadesBase){
                listViewHtml.data("kendoMobileListView").destroy();
            }

            listViewHtml.kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template-unidad").text(),
                click: function(e) {
                    window.sessionStorage.setItem("idUnidad", e.dataItem.idUnidad);
                    window.sessionStorage.setItem("unidad", e.dataItem.unidad);

                    seleccionarUnidadBase();
                }
            });

            //Selecciona el primero
            if (window.sessionStorage.getItem("idUnidad") == null) {
                window.sessionStorage.setItem("idUnidad",resultado[0].idUnidad);
                window.sessionStorage.setItem("unidad", resultado[0].unidad);
            }
            seleccionarUnidadBase();
            terminoCargando();
            yaCargoUnidadesBase = true;
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function cargarBasesTipo(){
    variablesCommodityActivo = false;
    variableBaseActivo = true;
    variablesUnidadActivo = false;
    variablesTablaActivo = false;

    var titulo = $("span[data-role='view-title']");
    $.each(titulo,function(i,obj){
        $(obj).removeAttr("style");
    });

    if (!yaCargoBasesCommodity) {
        obtenerBasesCommodity();
    }

    obtenerTipoBase();
    cambiarColorFondoTabs();
}

function cargarBasesUnidad(){
    variablesCommodityActivo = false;
    variableBaseActivo = false;
    variablesUnidadActivo = true;
    variablesTablaActivo = false;

    var titulo = $("span[data-role='view-title']");
    $.each(titulo,function(i,obj){
        $(obj).removeAttr("style");
    });

    if (!yaCargoBasesCommodity) {
        obtenerBasesCommodity();
    }

    cambiarColorFondoTabs();

}

function cargarBasesTabla(){
    cargando();
    variablesCommodityActivo = false;
    variableBaseActivo = false;
    variablesUnidadActivo = false;
    variablesTablaActivo = true;

    var idCommodity = window.sessionStorage.getItem("idBasesCommodity");
    var idUnidad = window.sessionStorage.getItem("idUnidad");
    var idTipo = window.sessionStorage.getItem("idTipoBase");

    var url = urlBase + "ObtenerTablaBases";
    var params = JSON.stringify({
        idCommodity : idCommodity,
        idTipo: idTipo,
        idUnidad: idUnidad
    });

    console.log(params);
    //$.support.cors = true;
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var renglones = "[" + t.ObtenerTablaBasesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(renglones);
            //console.log(renglones);

            var dataSource = new kendo.data.DataSource({
                data: resultado
            });

            $("#listview-tabla").kendoMobileListView({
                dataSource: dataSource,
                template: $("#listview-template-tabla").text()
            });
            window.sessionStorage.setItem("idTabla",0);

            var titulo = $("span[data-role='view-title']");
            titulo.css("font-size","0.7em");
            var tipo = window.sessionStorage.getItem("tipoBase");
            var unidad = window.sessionStorage.getItem("unidad");
            titulo.html("Tipo: " + tipo + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad: " + unidad);

            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });

    cambiarColorFondoTabs();

}

function irGraficaBases(origen,destino,tipoPrecio,titulo){
    window.sessionStorage.setItem("origen",origen);
    window.sessionStorage.setItem("destino",destino);
    window.sessionStorage.setItem("tipoPrecio",tipoPrecio);
    window.sessionStorage.setItem("titulo",titulo);
    window.location = "grafica-bases.html";
}

function obtenerGraficaBases(){
    cargando();
    var idCommodity = window.sessionStorage.getItem("idBasesCommodity");
    var idUnidad = window.sessionStorage.getItem("idUnidad");
    var idTipo = window.sessionStorage.getItem("idTipoBase");
    var origen = window.sessionStorage.getItem("origen");
    var destino = window.sessionStorage.getItem("destino");
    var volumen = window.sessionStorage.getItem("volumen");
    var tipoPrecio = window.sessionStorage.getItem("tipoPrecio");
    var titulo = window.sessionStorage.getItem("titulo");

    var alto = $(window).height()-80;
    var ancho = $(window).width();
    var container = $("#container");

    container.css("min-width",ancho);
    container.css("height",alto);
    $("#divTitulo").text(titulo);

    var url = urlBase + "ObtenerGraficaBases";
    var params = JSON.stringify({
        idCommodity : parseInt(idCommodity),
        //idUnidad : idUnidad,
        idTipo: parseInt(idTipo),
        origen: origen,
        destino: destino,
        //volumen: volumen,
        tipoPrecio: tipoPrecio
    });

    console.log(params);
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=uft-8",
        data: params,
        success: function (e) {
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var renglones = "[" + t.ObtenerGraficaBasesResult.replace(/}{/g,"},{") + "]";
            var resultado = JSON.parse(renglones);
            console.log(renglones);

            //Separar por serie
            var seriesTitulos = [];
            var categorias = [];
            var series = [];
            var numeroDeValores = 0;


            $.each(resultado,function(i,obj){
                var encabezado = obj.encabezado;
                var serie = obj.serie;
                var valorX = obj.valorX;
                var valorY = obj.valorY;

                //Categorias
                if ($.inArray(encabezado,categorias) == -1)
                    categorias.push(encabezado);

                //Series
                if($.inArray(serie,seriesTitulos) == -1){
                    seriesTitulos.push(serie);
                    series.push({ name: serie,marker:{enabled:false},data:[] });
                }
                var idSerie = $.inArray(serie,seriesTitulos);

                //Valores
                var fechaX = valorX.split("/");
                series[idSerie].data.push([Date.UTC(1970,fechaX[1]-1,fechaX[0]),parseFloat(valorY)]);
                numeroDeValores++;
            });

            $.each(series,function(i,obj){
                $.each(obj.data,function(j,d){
                    if (d.toString() == 'NaN')
                        series[i].data[j] = null
                });
            });

            console.log(series);
            //Establece el ancho
            var anchoDeLaGrafica = 800;

            //var anchoDeLaGrafica = 60 * (numeroDeValores / 10);

            if (alto < anchoDeLaGrafica)
                container.css("height",anchoDeLaGrafica);

            var titulo = "";

            $(function () {
                $('#container').highcharts({/**/
                chart: {
                    type: 'spline',
                    inverted: true,
                    spacingRight: 40,
                    width: ancho
                },
                    title: {
                        text: ' ',
                        align: 'top'
                    },
                    legend: {
                        align:'top',
                        verticalAlign:'right',
                        margin:10,
                        x: 60,
						width:270,
						itemStyle: {
							fontSize: '8px'
						}
                    },
                    xAxis: {
                        type: 'datetime',
						labels: {
                            rotation: +45,
                            align: 'right',
                            style: {
                                fontSize: '8px'
                            }
                        },
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%b'
                        },tickInterval: 30 * 24 * 3600 * 1000
                    },
                    yAxis: {
						labels: {
                            rotation: 90,
                            align: 'right',
                            style: {
                                fontSize: '8px'
                            }
                        },
                        title: {
                            text: titulo
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                                Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y;
                        }

                    },
                    series:
                        series

                });
				var legenda = document.children[0].children[1].children[0].children[1].children[1].children[0].children[0].children[0].children[9];
				legenda.setAttribute("transform", "translate(".concat(($(window).height()-260).toString()).concat(",10),rotate(90)"));							
            });

            terminoCargando();

        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });

}

function seleccionarTodasLasNotificaciones(){
    $.each(arbolDeNotificaciones,function(i,obj){
        notificacionesSeleccionadas.push(obj.idElemento);
    });
}

/* END BASES */
var arbolDeNotificaciones;
function cargarNotificaciones(){
    var url = urlBase + "ObtenArbolNotificaciones";

    if (!yaCargo1erNivel) {
        cargando();
        $.ajax({
            url: url,
            crossDomain: true,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=uft-8",
            success: function (e) {
                var t = JSON.parse(JSON.stringify(e));
                var arbol = "[" + t.ObtenArbolNotificacionesResult.replace(/}{/g,"},{") + "]";
                arbolDeNotificaciones = JSON.parse(arbol);
                //console.log(arbolDeNotificaciones);

                var datosPadre = [];
                $.each(arbolDeNotificaciones,function(i,obj){
                    if (obj.idElementoPadre == 0)
                        datosPadre.push(obj);
                });

                var dataSource = new kendo.data.DataSource({
                    data: datosPadre
                });

                var hListView = $("#listview-1");

                hListView.kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#listview-template").text(),
                    click: function(e) {
                        var idElemento = e.dataItem.idElemento;
                        var datosHijo = [];
                        $.each(arbolDeNotificaciones,function(i,obj){
                           if (obj.idElementoPadre == idElemento)
                                datosHijo.push(obj);
                        });
                        if (datosHijo.length > 0)
                            cargarSegundoNivel(datosHijo, e.dataItem.nombre);
                        else
                            seleccionarNotificacion(idElemento);

                        validaAMedias();

                    }
                });

                cargarConfiguracionUsuario();
                validaAMedias();
                yaCargo1erNivel = true;
                terminoCargando();
            },
            error: function (e) {
                console.log(e);
                terminoCargando();
            }
        });
    }
}

function cargarSegundoNivel(datos,nombre){
    window.kendoMobileApplication.navigate("#view-2");
    var listado = $("#listview-2");
    $("#titulo2").text(nombre);

    if (yaCargo2doNivel)
        listado.data("kendoMobileListView").destroy();

    var dataSource = new kendo.data.DataSource({
        data: datos
    });

    listado.kendoMobileListView({
        dataSource: dataSource,
        template: $("#listview-template").text(),
        click: function(e) {
            var idElemento = e.dataItem.idElemento;
            var datosHijo = [];
            $.each(arbolDeNotificaciones,function(i,obj){
                if (obj.idElementoPadre == idElemento)
                    datosHijo.push(obj);
            });
            if (datosHijo.length > 0)
                cargarTercerNivel(datosHijo, e.dataItem.nombre);
            else
                seleccionarNotificacion(idElemento);

            validaAMedias();
        }
    });
    yaCargo2doNivel = true;
}

function cargarTercerNivel(datos,nombre){
    window.kendoMobileApplication.navigate("#view-3");
    var listado = $("#listview-3");

    $("#titulo3").text(nombre);

    if (yaCargo3erNivel)
        listado.data("kendoMobileListView").destroy();

    var dataSource = new kendo.data.DataSource({
        data: datos
    });

    listado.kendoMobileListView({
        dataSource: dataSource,
        template: $("#listview-template").text(),
        click: function(e) {
            var idElemento = e.dataItem.idElemento;
            var datosHijo = [];
            $.each(arbolDeNotificaciones,function(i,obj){
                if (obj.idElementoPadre == idElemento)
                    datosHijo.push(obj);
            });

            if (datosHijo.length > 0)
                cargarCuartoNivel(datosHijo, e.dataItem.nombre);
            else
                seleccionarNotificacion(idElemento);

            validaAMedias();
        }
    });
    yaCargo3erNivel = true;
}

function cargarCuartoNivel(datos,nombre){
    window.kendoMobileApplication.navigate("#view-4");

    $("#titulo4").text(nombre);

    if (yaCargo4toNivel)
        $("#listview-4").data("kendoMobileListView").destroy();

    var dataSource = new kendo.data.DataSource({
        data: datos
    });

    $("#listview-4").kendoMobileListView({
        dataSource: dataSource,
        template: $("#listview-template").text(),
        click: function(e) {
            var idElemento = e.dataItem.idElemento;
            seleccionarNotificacion(idElemento);
            validaAMedias()

        }
    });
    yaCargo4toNivel = true;
}

function marcarSeleccionados(){
    $.each(arbolDeNotificaciones,function(i,obj){
        var img = $("#imgLista_" + obj.idElemento);
        var indice = notificacionesSeleccionadas.indexOf(obj.idElemento);
        if (indice != -1)
            img.attr("src","imgs/variables/icono_lista_selected.png");
        else
            img.attr("src","imgs/variables/icono_lista_unselected.png");
    });
}

function seleccionarNotificacion(idSeleccionado){

    var img = $("#imgLista_" + idSeleccionado);

    var indice = notificacionesSeleccionadas.indexOf(idSeleccionado);
    if (indice == -1){
        img.attr("src","imgs/variables/icono_lista_selected.png");
        notificacionesSeleccionadas.push(idSeleccionado);
        seleccionarHijos(idSeleccionado);
    } else {
        img.attr("src","imgs/variables/icono_lista_unselected.png");
        notificacionesSeleccionadas.splice(indice,1);
        deseleccionarHijos(idSeleccionado);
    }
}

function seleccionarHijos(id){
    //Si tiene hijos seleccionarlos
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == id){
            var indiceHijo = notificacionesSeleccionadas.indexOf(obj.idElemento);
            if (indiceHijo == -1) {
                notificacionesSeleccionadas.push(obj.idElemento);
                seleccionarHijos(obj.idElemento);
            }
        }
    });
}

function deseleccionarHijos(id){
    //Si tiene hijos seleccionarlos
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == id){
            var indiceHijo = notificacionesSeleccionadas.indexOf(obj.idElemento);
            if (indiceHijo != -1) {
                notificacionesSeleccionadas.splice(indiceHijo,1);
                deseleccionarHijos(obj.idElemento);
            }
        }
    });
}

function validaAMedias(){

    //Recorre los de primer nivel
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == 0){
            var cantidadHijos = contarHijos(obj.idElemento);
            var cantidadHijosSeleccionados =contarHijosSeleccionados(obj.idElemento);

            var img = $("#imgLista_" + obj.idElemento);
            if (cantidadHijos == cantidadHijosSeleccionados && cantidadHijos != 0)
                img.attr("src","imgs/variables/icono_lista_selected.png");
            else if (cantidadHijosSeleccionados == 0)
                img.attr("src","imgs/variables/icono_lista_unselected.png");
            else
                img.attr("src","imgs/variables/icono_lista_selected_half.png");

            $.each(arbolDeNotificaciones,function(j,obj2){
                if (obj2.idElementoPadre == obj.idElemento){
                    var cantidadHijos2 = contarHijos(obj2.idElemento);
                    var cantidadHijosSeleccionados2 = contarHijosSeleccionados(obj2.idElemento);

                    var img = $("#imgLista_" + obj2.idElemento);
                    var indice2 = notificacionesSeleccionadas.indexOf(obj2.idElemento);
                    if (cantidadHijos2 == 0 && indice2 != -1)//Sin hijos seleccionado
                        img.attr("src","imgs/variables/icono_lista_selected.png");
                    else if (cantidadHijos2 == cantidadHijosSeleccionados2 && cantidadHijos2 != 0 && indice2 != -1)//Todos los hijos seleccionados
                        img.attr("src","imgs/variables/icono_lista_selected.png");
                    else if (cantidadHijosSeleccionados2 == 0 && cantidadHijos2 == 0 && indice2 == -1)//Sin seleccionar
                        img.attr("src","imgs/variables/icono_lista_unselected.png");
                    else if (cantidadHijos2 > 0 && cantidadHijosSeleccionados2 > 0)
                        img.attr("src","imgs/variables/icono_lista_selected_half.png");
                    else
                        img.attr("src","imgs/variables/icono_lista_unselected.png");

                    $.each(arbolDeNotificaciones,function(k,obj3){
                        if (obj3.idElementoPadre == obj2.idElemento){
                            var cantidadHijos3 = contarHijos(obj3.idElemento);
                            var cantidadHijosSeleccionados3 =contarHijosSeleccionados(obj3.idElemento);

                            var img = $("#imgLista_" + obj3.idElemento);
                            var indice3 = notificacionesSeleccionadas.indexOf(obj3.idElemento);
                            if (cantidadHijos3 == 0 && indice3 != -1)//Sin hijos seleccionado
                                img.attr("src","imgs/variables/icono_lista_selected.png");
                            else if (cantidadHijos3 == cantidadHijosSeleccionados3 && cantidadHijos3 != 0 && indice3 != -1)//Todos los hijos seleccionados
                                img.attr("src","imgs/variables/icono_lista_selected.png");
                            else if (cantidadHijosSeleccionados3 == 0 && cantidadHijos3 == 0 && indice3 == -1)//Sin seleccionar
                                img.attr("src","imgs/variables/icono_lista_unselected.png");
                            else if (cantidadHijos3 > 0 && cantidadHijosSeleccionados3 > 0)
                                img.attr("src","imgs/variables/icono_lista_selected_half.png");
                            else
                                img.attr("src","imgs/variables/icono_lista_unselected.png");

                            $.each(arbolDeNotificaciones,function(k,obj4){
                                if (obj4.idElementoPadre == obj3.idElemento){
                                    var cantidadHijos4 = contarHijos(obj4.idElemento);
                                    var cantidadHijosSeleccionados4 =contarHijosSeleccionados(obj4.idElemento);

                                    var img = $("#imgLista_" + obj4.idElemento);
                                    var indice4 = notificacionesSeleccionadas.indexOf(obj4.idElemento);
                                    if (cantidadHijos4 == 0 && indice4 != -1)//Sin hijos seleccionado
                                        img.attr("src","imgs/variables/icono_lista_selected.png");
                                    else if (cantidadHijos4 == cantidadHijosSeleccionados4 && cantidadHijos4 != 0 && indice4 != -1)//Todos los hijos seleccionados
                                        img.attr("src","imgs/variables/icono_lista_selected.png");
                                    else if (cantidadHijosSeleccionados4 == 0 && cantidadHijos4 == 0 && indice3 == -1)//Sin seleccionar
                                        img.attr("src","imgs/variables/icono_lista_unselected.png");
                                    else if (cantidadHijos4 > 0 && cantidadHijosSeleccionados4 > 0)
                                        img.attr("src","imgs/variables/icono_lista_selected_half.png");
                                    else
                                        img.attr("src","imgs/variables/icono_lista_unselected.png");

                                }
                            });
                        }
                    });

                }
            });
        }
    });
}

function contarHijos(id){
    var cantidad = 0;
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == id){
            if (tieneHijos(obj.idElemento))
            {
                $.each(arbolDeNotificaciones,function(j,obj2){
                    if (obj2.idElementoPadre == obj.idElemento){
                        if (tieneHijos(obj2.idElemento))
                        {
                            $.each(arbolDeNotificaciones,function(j,obj3){
                                if (obj3.idElementoPadre == obj2.idElemento){
                                    if (tieneHijos(obj3.idElemento))
                                    {
                                        cantidad += 1;
                                    }
                                    cantidad += 1;
                                }
                            });
                        }
                        cantidad += 1;
                    }
                });
            }
            cantidad += 1;
        }
    });
    return cantidad;
}

function tieneHijos(idPadre){
    var tieneHijos = false;
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == idPadre){
            tieneHijos = true;
            return;
        }
    });
    return tieneHijos;
}

function contarHijosSeleccionados(id){
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == id){
            var indiceHijo = notificacionesSeleccionadas.indexOf(obj.idElemento);
            if (indiceHijo != -1) {
                cantidad += 1;
            }
        }
    });

    var cantidad = 0;
    $.each(arbolDeNotificaciones,function(i,obj){
        if (obj.idElementoPadre == id){
            if (tieneHijos(obj.idElemento))
            {
                $.each(arbolDeNotificaciones,function(j,obj2){
                    if (obj2.idElementoPadre == obj.idElemento){
                        if (tieneHijos(obj2.idElemento))
                        {
                            $.each(arbolDeNotificaciones,function(j,obj3){
                                if (obj3.idElementoPadre == obj2.idElemento){
                                    if (tieneHijos(obj3.idElemento))
                                    {
                                        $.each(arbolDeNotificaciones,function(j,obj4){
                                            if (obj4.idElementoPadre == obj3.idElemento){
                                                var indiceHijo = notificacionesSeleccionadas.indexOf(obj4.idElemento);
                                                if (indiceHijo != -1) {
                                                    cantidad += 1;
                                                }
                                            }
                                        });
                                    }
                                    var indiceHijo = notificacionesSeleccionadas.indexOf(obj3.idElemento);
                                    if (indiceHijo != -1) {
                                        cantidad += 1;
                                    }
                                }
                            });
                        }
                        var indiceHijo = notificacionesSeleccionadas.indexOf(obj2.idElemento);
                        if (indiceHijo != -1) {
                            cantidad += 1;
                        }
                    }
                });
            }
            var indiceHijo = notificacionesSeleccionadas.indexOf(obj.idElemento);
            if (indiceHijo != -1) {
                cantidad += 1;
            }
        }
    });
    return cantidad;

    return cantidad;
}

function cargarConfiguracionUsuario(){
    cargando();
    var url = urlBase + "ObtenerConfiguracionNotificaciones";

    var idUsuario = window.localStorage.getItem("idUsuario");
    var params = JSON.stringify({
        idClienteMovil : parseInt(idUsuario)
    });


    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        data: params,
        contentType: "application/json; charset=uft-8",
        success: function (e) {
            notificacionesSeleccionadas = [];
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var arbol = "[" + t.ObtenerConfiguracionNotificacionesResult.replace(/}{/g, "},{") + "]";
            var configuracionNotificaciones = JSON.parse(arbol);
            //console.log(arbolDeNotificaciones);
            $.each(configuracionNotificaciones,function(i,obj){
                notificacionesSeleccionadas.push(obj.idElemento);
            });

            validaAMedias();

            terminoCargando();
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

function guardarNotificaciones(){
    cargando();
    var url = urlBase + "GuardarConfiguracionNotificaciones";

    var elementos = notificacionesSeleccionadas.join(",");
    var idUsuario = window.localStorage.getItem("idUsuario");
    var params = JSON.stringify({
        idClienteMovil : parseInt(idUsuario),
        idElementos : elementos
    });
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        data: params,
        contentType: "application/json; charset=uft-8",
        success: function (e) {
            notificacionesSeleccionadas = [];
            console.log(e);
            var t = JSON.parse(JSON.stringify(e));
            var arbol = "[" + t.GuardarConfiguracionNotificacionesResult.replace(/}{/g, "},{") + "]";
            var configuracionNotificaciones = JSON.parse(arbol);
            console.log(arbol);
            terminoCargando();
            alert("Se guardó la configuración con éxito");
        },
        error: function (e) {
            console.log(e);
            terminoCargando();
        }
    });
}

var notificacionesSeleccionadas = [];

var yaCargo1erNivel = false;
var yaCargo2doNivel = false;
var yaCargo3erNivel = false;
var yaCargo4toNivel = false;
var yaCargoUnidadesBase = false;

function cargando() {
    $.blockUI({
        message: $("#displayBox"),
        css: {
            top: (window.innerHeight - 80) / 2 + "px",
            left: (window.innerWidth - 80) / 2 + "px",
            width: "80px",
            border: "0px",
            backgroundColor: ""
        }
    })
}

function terminoCargando() {
    setTimeout($.unblockUI, 10)
}
