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
let puntuacion = document.querySelector("h2");
let canvas = document.querySelector("#tetris");
let ctx = canvas.getContext("2d"); 
ctx.scale(30, 30);
let puntos = 0;


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
        if(piezaObjeto.y == 0){
            alert("GAME OVER");
            grid = generarGrid();
            score = 0;
            
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
    consultarGrid();
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

function consultarGrid(){
    let filas = 0;
    for (let i = 0; i < grid.length; i++) {
        let filaLlena = true;
        for (let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] == 0){
                filaLlena = false;
            }
            
        }
        if(filaLlena){
            grid.splice(i, 1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            filas++;
        }   
    }

    if(filas == 1){
        puntos+=10;
    } else if (filas == 2){
        puntos+=30;
    } else if (filas == 3){
        puntos+=50;
    } else if (filas > 3){
        puntos+=100;
    }
    puntuacion.innerHTML = "Puntos: " + puntos;
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

function colision(x, y, piezaRotada){
    let pieza = piezaRotada || piezaObjeto.pieza;
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

let heldPiece = null; // initialize heldPiece as null

// function to hold a piece
function holdPiece() {
  if (heldPiece === null) {
    heldPiece = currentPiece;
    currentPiece = nextPiece;
    nextPiece = generateRandomPiece(); // generate a new next piece
    drawNextPiece(); // update next piece display
  } else {
    // swap heldPiece and currentPiece
    let tempPiece = heldPiece;
    heldPiece = currentPiece;
    currentPiece = tempPiece;
  }
  drawHeldPiece(); // update held piece display
}

// function to display the held piece
function drawHeldPiece() {
  let heldCanvas = document.getElementById('held-piece');
  let heldCtx = heldCanvas.getContext('2d');
  heldCtx.clearRect(0, 0, heldCanvas.width, heldCanvas.height); // clear the canvas

  if (heldPiece !== null) {
    let blockWidth = heldCanvas.width / 5;
    let blockHeight = heldCanvas.height / 5;
    for (let i = 0; i < heldPiece.blocks.length; i++) {
      let block = heldPiece.blocks[i];
      let x = block.col * blockWidth;
      let y = block.row * blockHeight;
      heldCtx.fillStyle = block.color;
      heldCtx.fillRect(x, y, blockWidth, blockHeight);
    }
  }
}




let piezaObjeto = generarPiezaRandom();
let grid = generarGrid();
renderizarPieza();

setInterval(nuevoEstadoJuego, 500)

document.addEventListener("keydown", function(e){
    let key = e.code;
    console.log(key)
    if(key == "ArrowDown"){
        moverAbajo();
    } else if(key == "ArrowLeft"){
        moverIzq();
    } else if(key == "ArrowRight"){
        moverDer();
    } else if(key == "KeyC"){
        rotar();
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

