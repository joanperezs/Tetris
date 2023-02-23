const PIEZAS = [    // Forma de las piezas
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]

    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
]

const COLORES = [ // Lista de colores
    "#fff",
    '#9b5fe0',
    '#16a4d8',
    '#60dbe8',
    '#8bd346',
    '#efdf48',
    '#f9a52c',
    '#d64e12'
]

const keyMap = { // Mapa de teclas
    ArrowDown: moverAbajo,
    ArrowLeft: moverIzq,
    ArrowRight: moverDer,
    KeyC: rotar,
    KeyX: guardarPieza,
};


// Variables globales
const FILAS = 20;
const COLUMNAS = 10;
let puntuacion = document.querySelector("h2");
let canvas = document.querySelector("#tetris");
let ctx = canvas.getContext("2d"); 
ctx.scale(30, 30);
let puntos = 0;


function generarPiezaRandom(){ // Genera una pieza aleatoria.
    piezaCambiada = false;
    let random = Math.floor(Math.random()*7) // (Hay 7 piezas)
    let pieza = PIEZAS[random]
    let colorIndex = random+1;
    let x = 4;
    let y = 0;
    return {pieza, x, y, colorIndex}
}

function renderizarPieza(){
    

    piezaObjeto.pieza.some((fila, i) => fila.some((celula, j) => { // Recorre la pieza y pinta los 1. 
        if(celula == 1){
            ctx.fillStyle = COLORES[piezaObjeto.colorIndex];
            ctx.fillRect(piezaObjeto.x+j,piezaObjeto.y+i,1,1)
        }
    }));

}

function moverAbajo(){
    if(!colision(piezaObjeto.x, piezaObjeto.y+1)){ // Si no hay colisión, se mueve hacia abajo
        piezaObjeto.y+=1;
    }
    else{
        piezaObjeto.pieza.some((fila, i) => fila.some((celula, j) => {
            if(celula == 1){
                let p = piezaObjeto.x+j;
                let q = piezaObjeto.y+i;
                grid[q][p] = piezaObjeto.colorIndex; // Si hay colisión, se pinta la pieza en el grid
            }
        }));
    

        if(piezaObjeto.y == 0){ // Si la pieza llega a la parte superior del grid, se acaba el juego
            alert("GAME OVER");
            grid = generarGrid();
            score = 0;
            
        }
        piezaObjeto = null; // Se genera una nueva pieza
    }
    renderizarGrid();
}

function moverIzq(){ 
    if (!colision(piezaObjeto.x-1,piezaObjeto.y)) { // Si no hay colision, se mueve hacia la izquierda
        piezaObjeto.x-=1;
    }


    renderizarGrid();

}

function moverDer(){ 

    if (!colision(piezaObjeto.x+1,piezaObjeto.y)) { // Si no hay colision, se mueve hacia la derecha
        piezaObjeto.x+=1;
    }

    renderizarGrid();
    
}


function nuevoEstadoJuego(){ // Función para actualizar el juego
    consultarGrid();
    if(piezaObjeto == null){
        piezaObjeto = generarPiezaRandom();
        renderizarPieza();
    }
    moverAbajo();
}

function generarGrid(){ // Genera el grid
    let grid = []
    for (let i = 0; i < FILAS; i++) {
        grid.push([]);
        for (let j = 0; j < COLUMNAS; j++) {
            grid[i].push(0);
            
        }
        
    }
    return grid;
}

function consultarGrid(){  // Consulta las piezas del grid
    let filas = 0;
    for (let i = 0; i < grid.length; i++) {
        let filaLlena = true; 
        for (let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] == 0){
                filaLlena = false;
            }
            
        }
        if(filaLlena){ // Si la fila está llena, se elimina y se añade una fila vacía
            grid.splice(i, 1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            filas++;
        }   
    }

    switch (filas) { // Se añade una puntuación según las filas eliminadas
        case 1:
            puntos += 10;
            break;
        case 2:
            puntos += 30;
            break;
        case 3:
            puntos += 50;
            break;
        default:
            puntos += filas * 100;
            break;
    }
    
    puntuacion.innerHTML = "Puntos: " + puntos;
}

function renderizarGrid(){ // Dibuja el grid con las piezas ya colocadas (si hay)
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = COLORES[grid[i][j]];
            ctx.fillRect(j,i,1,1)
            
        }
        
    }
    renderizarPieza();
}


function colision(x, y, piezaRotada = piezaObjeto.pieza){ // Función para comprobar si hay colisión
    return piezaRotada.some((fila, i) => fila.some((celula, j) => { 
        if(celula == 1){
            const p = x + j;
            const q = y + i;
            return p < 0 || p >= COLUMNAS || q >= FILAS || grid[q][p] > 0; // Si la posicion horizontal es menor que 0 o mayor que el número de columnas, o la posición vertical es mayor que el número de filas, o la posición del grid es mayor que 0, devuelve true.
        }
    }));
}

let piezaObjetoCambiada = null; // 
let piezaCambiada = false; 


function guardarPieza() {
    
    if(colision(piezaObjeto.x+1 , piezaObjeto.y) || colision(piezaObjeto.x-1 , piezaObjeto.y)){
        return;
    }

    if(piezaCambiada){
        return;
    }
    
    if (piezaObjetoCambiada === null) {

        piezaObjetoCambiada = piezaObjeto.pieza;
        piezaObjetoCambiada.x = 0;
        piezaObjetoCambiada.y = 0;
                
        piezaObjeto = generarPiezaRandom();
        piezaObjeto.y = 0 // Resetear posición de la nueva pieza
        renderizarPieza(); 
    
    } else {
        // Cambiar pieza
        let piezaTemporal = piezaObjetoCambiada;
        piezaObjetoCambiada = piezaObjeto.pieza;
        piezaObjeto.pieza = piezaTemporal;
    }

    piezaCambiada = true;  
    piezaObjeto.y = 0;
    renderizarPieza(); 
          
    
}






let piezaObjeto = generarPiezaRandom();
let grid = generarGrid();
renderizarPieza();

setInterval(nuevoEstadoJuego, 500)

// Eventos de teclado
document.addEventListener("keydown", function(e){
    let key = e.code;
    
    const fn = keyMap[key];
    if (fn) {
        fn();
    }

})

function rotar(){
    let piezaRotada = [];
    let pieza = piezaObjeto.pieza;
    
    for (let i = 0; i < pieza.length; i++) {
        piezaRotada.push([]);
        for (let j = 0; j < pieza[i].length; j++) {
            piezaRotada[i].push(0);
        }
    }
    for (let i = 0; i < pieza.length; i++) {
        for (let j = 0; j < pieza[i].length; j++) {
            piezaRotada[i][j] = pieza[j][i]
        }
    }

    for (let i = 0; i < piezaRotada.length; i++) {
        piezaRotada[i].reverse();
    }

    if(!colision(piezaObjeto.x, piezaObjeto.y, piezaRotada)){
        piezaObjeto.pieza = piezaRotada;
    }

}



