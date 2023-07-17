var tds = document.getElementsByClassName('cell');
var matriz_hash = [['','',''], ['','',''], ['','','']]

/*
Elaborar um input para que o usuário decida se o primeiro irá jogar com 'X' ou 'O'
*/
jogadorAtual = 'x'

/*
Recebe as coordenadas do elemento na tabela e 
adiciona o elemento tanto na matriz quanto no HTML. 

@par (linha, coluna)
*/
function add_Move(i, j){

    if(tds[i*3 + j].childElementCount == 0){
        var img = document.createElement('img')
        matriz_hash[i][j] = jogadorAtual
        if(jogadorAtual == 'x'){
            img.src = 'img/icons8-x-100.png'
            tds[i*3 + j].appendChild(img)
            jogadorAtual = 'o'
        }else{
            img.src = 'img/icons8-o-100.png'
            tds[i*3 + j].appendChild(img)
            jogadorAtual = 'x'
        }
        setTimeout(function () {
            
            var result = check_Winner(matriz_hash)
            if (result == '' && isFull(matriz_hash)) {
                window.alert('Empatou')
                clean_board(matriz_hash)
            } else if (result == 'x' || result == 'o') {
                window.alert("O " + result + " ganhou!!")
                clean_board(matriz_hash)
            } else {
                move_Machine()
            }
        }, 1000);
    }
}

function move_Machine(){
    var img = document.createElement('img')

    action = bestMove(matriz_hash, jogadorAtual)
    i = action[0]
    j = action[1]
    matriz_hash[i][j] = jogadorAtual

    if (jogadorAtual == 'x') {
        img.src = 'img/icons8-x-100.png'
        tds[i * 3 + j].appendChild(img)
        jogadorAtual = 'o'
    } else {
        img.src = 'img/icons8-o-100.png'
        tds[i * 3 + j].appendChild(img)
        jogadorAtual = 'x'
    }

    setTimeout(function () {
        var result = check_Winner(matriz_hash)
        if (result == '' && isFull(matriz_hash)) {
            window.alert('Empatou')
            clean_board(matriz_hash)
        } else if (result == 'x' || result == 'o') {
            window.alert("O " + result + " ganhou!!")
            clean_board(matriz_hash)
        }
    }, 1000);

    
}

function clean_board(board){
    
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            board[i][j] = ''
        }
    }

    for(var i in tds){
        el = tds[i].querySelector('img')
        if(el != null){
            tds[i].removeChild(el)
        }
    }
}

/*
Verifica se alguém ganhou na linha i
Verifica se alguém ganhou na coluna j
Verifica se alguém ganhou em alguma das diagonais
*/
function line(i, matriz){
    if(matriz[i][1] != '' && matriz[i][0] == matriz[i][1] && matriz[i][1] == matriz[i][2])
        return matriz[i][1]
    else
        return ''
}

function column(j, matriz){
    if(matriz[1][j] != '' && matriz[0][j] == matriz[1][j] && matriz[1][j] == matriz[2][j])
        return matriz[1][j]
    else
        return ''
}

function diagonal(matriz){
    if((matriz[1][1] != '' && matriz[0][0] == matriz[1][1] && matriz[1][1] == matriz[2][2]) || (matriz[1][1] != '' && matriz[0][2] == matriz[1][1] && matriz[1][1] == matriz[2][0]))
        return matriz[1][1]
    else
        return ''
}

/*
Checa quem foi o vencedor com base nas funções predecessoras
*/
function check_Winner(tabuleiro){
    for(var i = 0; i < 3; i++){
        valor_linha = line(i, tabuleiro)
        valor_coluna = column(i, tabuleiro)
        
        if(valor_linha != '')
            return valor_linha
        else if(valor_coluna != '')
            return valor_coluna
    }

    valor_diag = diagonal(tabuleiro)
    if(valor_diag != '')
        return valor_diag
    else
        return ''
}


//Parte relacionada a IA(Minimax)

/*
Função para verificar se a matriz está cheia
*/
function isFull(board){
    cont = 0
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            if(board[i][j] != '')
                cont++
        }
    }

    if(cont == 9)
        return true
    else
        return false
}

/**
Função para copiar os elementos do tabuleiro superficialmente para outra matriz
 */
function copy_Elements(board){
    var new_matriz = [['','',''], ['','',''], ['','','']]
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            new_matriz[i][j] = board[i][j]
        }
    }

    return new_matriz
}


/*
Movimentos possíveis de serem feitos a partir de um dado estado da matriz
*/
function possibleMoves(board){
    var jogadas = []

    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            if(board[i][j] == '')
                jogadas.push([i,j])
        }
    }

    return jogadas
}

/*
Retorna uma matriz com o novo lance feito.
*/
function move(board, pos, jogador_eu){
    var new_tabuleiro = copy_Elements(board)

    new_tabuleiro[pos[0]][pos[1]] = jogador_eu

    return new_tabuleiro
}

/*
Retorna qual será o melhor lance para o computador
*/
function bestMove(board, jogador_eu){
    var jogadas = possibleMoves(board)

    var best = -Infinity
    var b_action = null
    for(var i in jogadas){
        var resultado = move(board, jogadas[i], jogador_eu)
        var valor = minimax(resultado, jogador_eu == 'x' ? 'o':'x', jogador_eu)

        if(valor > best){
            best = valor
            b_action = jogadas[i]
        }
    }
    return b_action
}

function minimax(tabuleiro, jogadorNivel, jogador_eu, maxdepth=9){
    var w = check_Winner(tabuleiro)

    if(w == jogador_eu) return 1
    if(w && w != jogador_eu) return -1
    if(!w && isFull(tabuleiro)) return 0


    var jogadas = possibleMoves(tabuleiro)

    if(jogadorNivel == jogador_eu){
        //MAX
        let best = -Infinity
        for(let i in jogadas){
            let resultado = move(tabuleiro, jogadas[i], jogadorNivel)
            let valor = minimax(resultado, jogadorNivel == 'x' ? 'o':'x', jogador_eu)
    
            if(valor > best){
                best = valor
            }
        }
        return best
    }else{
        //MIN
        let best = Infinity
        for(let i in jogadas){
            let resultado = move(tabuleiro, jogadas[i], jogadorNivel)
            let valor = minimax(resultado, jogadorNivel == 'x' ? 'o':'x', jogador_eu)
    
            if(valor < best){
                best = valor
            }
        }
        return best
    }
}
