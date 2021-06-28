const axios = require('axios');
const { guardarDB, leerDB } = require('../helpers/guardarArchivo');

class Busquedas {
    historial = [];

    constructor() {
        const historialDB = leerDB();

        if (historialDB) {
            this.historial = historialDB.historial;
        }
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => this.ucFirstAllWords(lugar))
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguaje': 'es'
        }
    }

    get paramsOpenWheathers() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    ucFirstAllWords = (str) => {
        var pieces = str.split(" ");
        for (var i = 0; i < pieces.length; i++) {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ");
    }

    async ciudad(lugar = '') {
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (e) {
            console.log('Error: ', e);
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWheathers, lat, lon }
            });
            const resp = await instance.get();
            const { temp, temp_min, temp_max } = resp.data.main;
            const { description } = resp.data.weather[0];
            return {
                desc: description,
                min: temp_min,
                max: temp_max,
                temp: temp
            };
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }
        this.historial = this.historial.slice(0, 5); // siempre tengo los ultimos 6 del historial

        this.historial.unshift(lugar.toLowerCase());

        const payload = {
            historial: this.historial
        }

        guardarDB(payload);
    }



}


module.exports = Busquedas;