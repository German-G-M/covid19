$('#js-formulario').submit(async () => {

    correoUsuario = correo.value
    passwordUsuario = contraseña.value
    console.log(correoUsuario)
    console.log(passwordUsuario)
    const JWT = await postData(correoUsuario, passwordUsuario)//par verificar usuario y contraseña
    console.log(JWT)
    const datospordia=await obtenerDatosPorDia(JWT,"confirmed")
    const datosmuertos=await obtenerDatosPorDia(JWT,"deaths")
    const datosrecuperados=await obtenerDatosPorDia(JWT,"recovered")
    $('#modal-inicio-sesion').modal('hide')
    graficoPais(datospordia,datosmuertos,datosrecuperados)


})

const postData = async (correo, password) => {
    try {
        const respuesta = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: correo, password: password })
        })
        if (respuesta.status!=422) {
            const { token } = await respuesta.json()
            localStorage.setItem('llave-token', token)//guardamos el local storage el token
            //console.log(token)
            document.getElementById('situacion_chile').style.display = 'block'
            document.getElementById('cerrar_sesion').style.display = 'block'
            document.getElementById('iniciar_sesion').style.display = 'none'
            return token
        }
        else {
            throw new error('Datos ingrersados no encontrados')
        }

    } catch (error) {
        console.error(`usuario y contraseña no encntrados ${error}`)
    }

}

const obtenerDatosPorDia = async (JWT,tipo) => {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/${tipo}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${JWT}`
            }
        })
        const { data } = await respuesta.json() //obtenemos los datos por dia
        console.log(data)
        return data
    } catch (error) {
        console.error(`error con el token ${error}`)
    }
}

const graficoPais=(datoC,datoM,datoR)=>{
    console.log(datoC)//mostramos el dato
    document.getElementById('situacion_chile').addEventListener('click',()=>{
        document.getElementById('situacion-mundial').style.display = 'none'
        document.getElementById('situacion-chile').style.display = 'block'
        console.log("prbando garfico de paises")
        fechas=[]
        totalC=[]
        totalM=[]
        totalR=[]
        //console.log(dato)//mostramos el dato
        datoC.forEach(element => {
            fechas.push(element.date)
            totalC.push(element.total)
        });
        datoM.forEach(element => {
            //fechas.push(element.date)
            totalM.push(element.total)
        });
        datoR.forEach(element => {
            //fechas.push(element.date)
            totalR.push(element.total)
        });

        const ctx = document.getElementById('grafico_linea').getContext('2d');
    if(myChart1){
        myChart1.destroy()
    }
    myChart1 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
              label:'Confirmados' ,//array con fechas
              data: totalC, //array
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },{
                label:'Muertos' ,//array con fechas
              data: totalM, //array
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },{
                label:'Recuperados' ,//array con fechas
              data: totalR, //array
              fill: false,
              borderColor: 'rgb(255, 206, 86)',
              tension: 0.1
            }]
          },
        options: {
            plugins:{
                title:{
                    display:true,
                    text: "CHILE"
                }
            }
        } 
    })

    })

}


const togleNavbarGraficos=()=>{
    $('#situacion_chile').toggle();
    $('#iniciar_sesion').toggle();
    $('#cerrar_sesion').toggle();
    $('#situacion-mundial').toggle();
    $('#situacion-chile').toggle();
}

$("#cerrar_sesion").on('click', (e) => {//botón cerrar sesión (volvemos todo a su estado inicial)
    e.preventDefault()
    localStorage.clear()
    togleNavbarGraficos()
})


