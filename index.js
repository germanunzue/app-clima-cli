const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busqueda = require('./models/busquedas');
require('dotenv').config();


const main = async() => {

    const busqueda = new Busqueda();
    let opt = null;
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const lugar = await leerInput('Ciudad: ');
                const lugares = await busqueda.ciudad(lugar);
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSel = lugares.find(lugar => lugar.id === id);
                busqueda.agregarHistorial(lugarSel.nombre);
                const temp = await busqueda.climaLugar(lugarSel.lat, lugarSel.lng);
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', temp.temp);
                console.log('Mīnima: ', temp.min);
                console.log('Máxima: ', temp.max);
                console.log('Como está el clima: ', temp.desc.green);
                break;
            case 2:
                busqueda.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i +1 }.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }

        if (opt !== 0) {
            console.log('\n');
            await pausa();
        }

    } while (opt !== 0)
}

main();