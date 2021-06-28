const inquirer = require('inquirer');
require('colors');


const menuOpts = [{
    type: 'list',
    name: 'opcion',
    message: 'Que desea Hacer ?',
    choices: [{
            value: 1,
            name: `${'1'.green}. Buscar ciudad`
        },
        {
            value: 2,
            name: `${'1'.green}. Historial`
        },
        {
            value: 0,
            name: `${'0'.green}. Salir`
        }
    ]
}];


const inquirerMenu = async() => {
    console.clear();
    console.log('================================'.green);
    console.log('     Seleccion una opción     '.white);
    console.log('================================\n'.green);

    const { opcion } = await inquirer.prompt(menuOpts);
    return opcion;

}

const pausa = async() => {
    const questions = [{
        name: 'input',
        type: 'input',
        message: `Presione ${'ENTER'.green} para continuar.`,
    }];
    const { input } = await inquirer.prompt(questions);
    return input;
}

const leerInput = async(msg) => {
    const questions = [{
        type: 'input',
        name: 'desc',
        message: msg,
        validate(val) {
            if (val.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    }];
    const { desc } = await inquirer.prompt(questions);
    return desc;
}

const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })
    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    });
    const pregunta = [{
        type: 'list',
        name: 'id',
        message: 'Que lugar desea consultar ?',
        choices
    }]

    const { id } = await inquirer.prompt(pregunta);
    return id;
}

const confirmar = async(msg) => {
    const pregunta = [{
        type: 'confirm',
        name: 'ok',
        message: msg
    }]
    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}

const mostrarListadoCheckList = async(tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    })

    const pregunta = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices
    }]

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}