//para el hito 1
//********************************************* */
//usando graficos canvas
//*********************************************** */
var dataPointsConfirmados = []
var dataPointsMuertos = []
var dataPointsRecuperados = []
var dataPointsActivos = []

window.onload = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Países con Covid 19"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Países"
        },
        axisY: {
            title: "",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: true
        },
        axisY2: {
            title: "",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E", //#bb3e03 
            includeZero: true
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "column",  //columna 1
            name: "Confirmados",
            color: "#bb3e03 ",
            showInLegend: true,
            yValueFormatString: "#,##0.# Personas",
            dataPoints: dataPointsConfirmados//aqui traemos nuestros array generado para confirmados
        },
        {
            type: "column", //columna2
            name: "Muertos",
            color: "#ee9b00",
            axisYType: "secondary",
            showInLegend: true,
            yValueFormatString: "#,##0.# Personas",
            dataPoints: dataPointsMuertos//aqui traemos nuestros array generado para muestros
        },
        {
            type: "column",//columna3
            name: "Recuperados",
            axisYType: "secondary",
            showInLegend: true,
            yValueFormatString: "#,##0.# Personas",
            dataPoints: dataPointsRecuperados//aqui traemos nuestros array generado para recuperados
        },
        {
            type: "column", //columna4
            name: "Activos",
            axisYType: "secondary",
            showInLegend: true,
            yValueFormatString: "#,##0.# Personas",
            dataPoints: dataPointsActivos//aqui traemos nuestros array generado para activos
        }
        ]
    });
    chart.render();


    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

}


//****************************************************
//provando con chart js
/********************************************************/

var dpPaises = []
var dpConfirmados = []
var dpMuertos = []
var dpRecuperados = []
var dpActivos = []
const ctx = document.getElementById('graficoChartjs').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange','pepe','lucho','marco','polo'], //(aqui vienen nombres de los países)
        labels: dpPaises,
        datasets: [{
            label: 'Confirmados',
            //data: [12, 19, 3, 5, 2, 3,20,25,50,60],//barra1(confirmados)
            data: dpConfirmados,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)', //rojo
                // 'rgba(54, 162, 235, 0.2)', //azul
                // 'rgba(255, 206, 86, 0.2)',//amarillo
                // 'rgba(75, 192, 192, 0.2)', //verde
                // 'rgba(153, 102, 255, 0.2)',//purpura
                // 'rgba(255, 159, 64, 0.2)' //naranja
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',//rojo
                // 'rgba(54, 162, 235, 1)',//azul
                // 'rgba(255, 206, 86, 1)',//amarillo
                // 'rgba(75, 192, 192, 1)',//verde
                // 'rgba(153, 102, 255, 1)',//purpura
                // 'rgba(255, 159, 64, 1)'//naranja
            ],
            borderWidth: 1
        },
        {
            label: 'Muertos',
            //data: [12, 19, 3, 5, 2, 3], //barra 2(muertos)
            data: dpMuertos,
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',//azul  
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',//azul
            ],
            borderWidth: 1
        }, {
            label: 'Recuperados',
            //data: [12, 19, 3, 5, 2, 3],//barra 3 (Recuperados)
            data: dpRecuperados,
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',//amarillo  
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',//amarillo
            ],
            borderWidth: 1
        }, {
            label: 'Activos',
            //data: [12, 19, 3, 5, 2, 3], //barra 4 (Activos)  
            data: dpActivos,
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',//verde  
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',//verde
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins:{
            title:{
                display:true,
                text: "PAISES CON COVID 19"
            }
        }
    }
});




//****************************************************** */
//petición a un endpoint usando java script
//****************************************************** */

fetch('http://localhost:3000/api/total')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        const { data } = myJson //con destructure, rescatamos solo los datos
        //console.log(data);
        mostrarDatos(data)//genera la tabla
        let datosGrafico = data.filter(element => element.confirmed > 100000)//filtramos los elementos
        //console.log(datosGrafico)
        generarBarras(datosGrafico)//genera grafico de barras
    });

    
//************************************** */
//generamos la tabla
//****************************************** */
const mostrarDatos = (data) => {
    let rows = ""
    data.forEach((element, index) => {
        pais = element.location
        confirmados = element.confirmed
        muertos = element.deaths
        recuperados = element.recovered
        activos = element.active
        //console.log(`${element.location}--${element.confirmed}--${element.deaths}--${element.recovered}--${element.active}`)
        rows += `
        <tr>
                <th scope="row">${index + 1}</th>
                <td>${pais}</td>
                <td>${confirmados}</td>
                <td>${muertos}</td>
                <td>${recuperados}</td>
                <td>${activos}</td>
                <td><a href="" data-toggle="modal" data-target="#exampleModal" onclick="generarTorta('${pais}','${confirmados}','${muertos}','${recuperados}','${activos}')"> ver detalle Canvas </a>
                    |<a href="" data-toggle="modal" data-target="#modalChartJs" onclick="generarTortaChartJs('${pais}','${confirmados}','${muertos}','${recuperados}','${activos}')"> ver detalle ChartJs </a>
                </td>
                
              </tr>
        `;
        //console.log("elemento del foreach:", element)
    });
    $('#js-tabla-datos tbody').append(rows)//añadimos todos los rows creados al tbody
}

//********************************* */
//generamos las barras con CANVAS
//******************************* */

const generarBarras = (objeto) => {
    objeto.forEach(e => {
        //genara para el canvas
        dataPointsConfirmados.push({ label: e.location, y: e.confirmed })
        dataPointsMuertos.push({ label: e.location, y: e.deaths })
        dataPointsRecuperados.push({ label: e.location, y: e.recovered })
        dataPointsActivos.push({ label: e.location, y: e.active })

        //genera para el chart.js
        dpPaises.push(e.location)
        dpConfirmados.push(e.confirmed)
        dpMuertos.push(e.deaths)
        dpRecuperados.push(e.recovered)
        dpActivos.push(e.active)
    })
    // console.log(dataPointsConfirmados)
    // console.log(dataPointsMuertos)
    // console.log(dataPointsRecuperados)
    // console.log(dataPointsActivos)
}


//******************************** */
//generamos la torta con CANVAS
//********************************* */
const generarTorta = (p, c, m, r, a) => {

    nombrePais = p
    confirmados = c
    muertos = m
    recuperados = r
    activos = a


    // console.log(nombrePais)
    // console.log(confirmados)
    // console.log(muertos)
    // console.log(recuperados)
    // console.log(activos)

    /*
    suma = parseInt(confirmados)  + parseInt(muertos) + parseInt(recuperados) + parseInt(activos)
    console.log(suma)

    let conf =  ((confirmados / suma) * 100).toFixed(2)
    let muer = ((muertos / suma) * 100).toFixed(2)
    let recup = ((recuperados / suma) * 100).toFixed(2)
    let activ = ((activos / suma) * 100).toFixed(2)
    console.log(conf)
    console.log(muer)
    console.log(recup)
    console.log(activ)
    */


    //window.onload = function () {

        var chart = new CanvasJS.Chart("chartContainerModal", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: nombrePais
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y} Personas",
                dataPoints: [
                    { y: confirmados, label: "Confirmados" },
                    { y: muertos, label: "Muertos" },
                    { y: recuperados, label: "Recuperados" },
                    { y: activos, label: "Activos" },

                ]
            }]
        });
        chart.render();
    //}
}
//*******************************************/
//generamos la otra torta con chartjs
//******************************************** */
let myChart1
const generarTortaChartJs = (p, c, m, r, a) => {
    nombrePais = p
    confirmados = c
    muertos = m
    recuperados = r
    activos = a

    // console.log(nombrePais)
    // console.log(confirmados)
    // console.log(muertos)
    // console.log(recuperados)
    // console.log(activos)
    
    
    const ctx = document.getElementById('graficoTortaChartjs').getContext('2d');
    if(myChart1){
        myChart1.destroy()
    }
    myChart1 = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Confirmados',
                'Muertos',
                'Recuperados',
                'Activos'
            ],
            datasets: [{
                label: nombrePais,
                data: [confirmados, muertos, recuperados,activos],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins:{
                title:{
                    display:true,
                    text: nombrePais
                }
            }
        } 
    })
}