async function getApi(){
    let respuesta = await fetch("https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=2021-01-01T00:00&end_date=2021-01-31T23:59&time_trunc=hour");
    if(respuesta.ok){
        console.log(respuesta);
        let datos = await respuesta.json();
        console.log(datos);
        let length = datos.included[0].attributes.values.length;
        let dict = [];
        for(let i=0; i<length; i++){
            let date = new Date(datos.included[0].attributes.values[i].datetime);
            let value = datos.included[0].attributes.values[i].value;
            dict.push({x: date, y: value});
        };

        let max_dict = 0;
        let fecha;
        for(let i=0;i<dict.length;i++){
            if(dict[i].y>max_dict){
                max_dict = dict[i].y;
                fecha = dict[i].x;
            }
        }
        let year = fecha.getFullYear();
        let month = fecha.getMonth()+1;
        let dt = fecha.getDate();
        let hour = fecha.getUTCHours();

        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }
        if(hour<10){
            hour = '0' + hour;
        }
        document.getElementById("max_luz").innerHTML = "Máximos luz = "+max_dict+"€/MWh a " + year+'-' + month + '-'+dt+ '-'+hour+':00';

        JSC.Chart("chartDiv", {
              title_label_text: 'Evolución precios luz (€/MWh)',
                annotations: [{
                    label_text: 'Fuente: Red Eléctrica Española',
                    position: 'bottom left'
              }],
              series: [
                {
                  points: dict
                }
              ]
            });
    }
}

getApi();




