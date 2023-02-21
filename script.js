const PIEZAS = [
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

const COLORES = [
    "#fff",
    '#9b5fe0',
    '#16a4d8',
    '#60dbe8',
    '#8bd346',
    '#efdf48',
    '#f9a52c',
    '#d64e12'
]

const FILAS = 20;
const COLUMNAS = 10;

let canvas = document.querySelector("#tetris");
let ctx = canvas.getContext("2d");
ctx.scale(30, 30);


function generarPiezaRandom(){
    let random = Math.floor(Math.random()*7)
    let pieza = PIEZAS[random]
    let colorIndex = random+1;
    let x = 4;
    let y = 0;
    return {pieza, x, y, colorIndex}
}

function renderizarPieza(){
    let pieza = piezaObjeto.pieza;
    for (let i = 0; i < pieza.length; i++) {
        for (let j = 0; j < pieza[i].length; j++) {
            if(pieza[i][j] == 1){
                ctx.fillStyle = COLORES[piezaObjeto.colorIndex];
                ctx.fillRect(piezaObjeto.x+j,piezaObjeto.y+i,1,1)
            }   
            
        }
    }
}

function moverAbajo(){
    if(!colision(piezaObjeto.x, piezaObjeto.y+1)){
        piezaObjeto.y+=1;
    }
    else{
        for (let i = 0; i < piezaObjeto.pieza.length; i++) {
            for (let j = 0; j < piezaObjeto.pieza[i].length; j++) {
                if(piezaObjeto.pieza[i][j] == 1){
                    let p = piezaObjeto.x+j;
                    let q = piezaObjeto.y+i;
                    grid[q][p] = piezaObjeto.colorIndex;


                }
                
            }
            
        }
        piezaObjeto = null;
    }
    renderizarGrid();
}
function moverIzq(){
    if (!colision(piezaObjeto.x-1,piezaObjeto.y)) {
        piezaObjeto.x-=1;
    }


    renderizarGrid();

}
function moverDer(){

    if (!colision(piezaObjeto.x+1,piezaObjeto.y)) {
        piezaObjeto.x+=1;
    }

    renderizarGrid();
    
}


function nuevoEstadoJuego(){
    if(piezaObjeto == null){
        piezaObjeto = generarPiezaRandom();
        renderizarPieza();
    }
    moverAbajo();
}

function generarGrid(){
    let grid = []
    for (let i = 0; i < FILAS; i++) {
        grid.push([]);
        for (let j = 0; j < COLUMNAS; j++) {
            grid[i].push(0);
            
        }
        
    }
    return grid;
}

function renderizarGrid(){
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = COLORES[grid[i][j]];
            ctx.fillRect(j,i,1,1)
            
        }
        
    }
    renderizarPieza();
}

function colision(x, y){
    let pieza = piezaObjeto.pieza;
    for (let i = 0; i < pieza.length; i++) {
        for (let j = 0; j < pieza[i].length; j++) {
            if(pieza[i][j] == 1){
                let p = x+j;
                let q = y+i;
                if(p>=0 && p<COLUMNAS && q<FILAS){
                    if(grid[q][p]>0){
                        return true;
                    }
                } else{
                    return true;
                }
            }
            
        }
        
        
    }
    return false;
}
let piezaObjeto = generarPiezaRandom();
let grid = generarGrid();
renderizarPieza();

setInterval(nuevoEstadoJuego, 500)

document.addEventListener("keydown", function(e){
    let key = e.code;
    if(key == "ArrowDown"){
        moverAbajo();
    } else if(key == "ArrowLeft"){
        moverIzq();
    } else if(key == "ArrowRight"){
        moverDer();
    } else if(key == "C"){
        rotar();
    }

})

// https://www.youtube.com/live/F_7FxsF-jNM?feature=share&t=4028