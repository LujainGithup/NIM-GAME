let numberOfHeaps;
let numberOfStones;
let currentHeapIndexAI = 0;
let userData = getUserData();
let userValue = 0;
let selectedLevelData = localStorage.getItem("selectedLevel");

document.getElementById('reloadButton').addEventListener('click', function () {
    location.reload();
});




function getUserData() {
    const userName = localStorage.getItem('user_name');
    const gameData = localStorage.getItem('gameData');
    const selectedLevel = localStorage.getItem('selectedLevel');
    if (userName && gameData && selectedLevel) {
        return {
            userName,
            gameData,
            selectedLevel,
        };
    } else {
        throw new Error('Some data is missing in local storage.');
    }
}

function getDataGame() {
    if (userData && userData.gameData) {
        const gameData = JSON.parse(userData.gameData);
        numberOfHeaps = gameData.numberOfHeaps;
        numberOfStones = gameData.numberOfStones.split(',').map(Number);
    } else {
        throw new Error('Invalid game data.');
    }
}

getDataGame();


const fatherElement = document.querySelector('.father');

const inputs = document.querySelector('.inputs');

const buttonElement = document.querySelector('#btn0');


if (fatherElement) {
    for (let i = 0; i < numberOfHeaps; i++) {
        const childDiv = document.createElement('div');
        childDiv.className = 'child';
        fatherElement.appendChild(childDiv);
        createGrandchildren(childDiv, numberOfStones[i]);
    }
} else {
    console.error('Parent element with class "father" not found.');
}

function createCh(heap, stones) {
    numberOfHeaps = heap;
    if (fatherElement) {
        for (let i = 0; i < numberOfHeaps; i++) {
            numberOfStones[i] = stones;
            const childDiv = document.createElement('div');
            childDiv.className = 'childAc';
            fatherElement.appendChild(childDiv);
            inputs.style.display = 'flex'
            createGrandchildren(childDiv, numberOfStones[i]);
            buttonElement.addEventListener('click', buttonClickHandler);
        }
    } else {
        console.error('Parent element with claasss "father" not found.');
    }
}

let currentGameState = [...numberOfStones];


function simulateEasyAIMove() {
    const stonesToRemove = Math.floor(Math.random() * 2) + 1; // Randomly choose 1 or 2 stones
    const randomHeapIndex = Math.floor(Math.random() * numberOfHeaps);
    return { heap: randomHeapIndex, stones: stonesToRemove };
}

function isGameOverAfterMove(move) {
    const tempStones = [...currentGameState];
    tempStones[move.heap] -= move.stones;
    return isGameOver(tempStones);
}


function getAvailableMoves() {
    const availableMoves = [];

    for (let i = 0; i < numberOfHeaps; i++) {
        for (let stones = 1; stones <= numberOfStones[i]; stones++) {
            availableMoves.push({ heap: i, stones: stones });
        }
    }

    return availableMoves;
}


const trimmedLevelData = selectedLevelData.trim();



function buttonClickHandler(event) {
    const clickedButton = document.querySelector('.number');
    const userValue = parseInt(clickedButton.value);

    if (![1, 2].includes(userValue)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a valid value (1 or 2)!",
        });
        return;
    }

    if (numberOfStones[0] === 0) {
        alert('Game Over! AI Win!');
        return;
    }

    // Update the value of the corresponding heap
    numberOfStones[0] -= userValue;
    console.log(numberOfStones[0]);

    const userChildDiv = document.createElement('div');
    userChildDiv.className = 'child';
    fatherElement.appendChild(userChildDiv);
    createGrandchildren(userChildDiv, numberOfStones[0]);

    const divToRemove = document.querySelector('.inputs');
    divToRemove.style.display = 'none';

    if (isGameOver()) {
        alert('You Win!');
        return;
    }




    if (selectedLevelData.toLowerCase() === "easy") {
        console.log("easy");
        const aiMove = simulateEasyAIMove();
        const aiStonesToRemove = aiMove.stones;
        


        numberOfStones[currentHeapIndexAI] -= aiStonesToRemove;
        console.log(numberOfStones[currentHeapIndexAI]);

        createCh(1, numberOfStones[currentHeapIndexAI]);

        if (isGameOver()) {
            alert('Game Over! AI Win!');
            return;
        }

        const divToDisplay = document.querySelector('.inputs');
        divToDisplay.style.display = 'flex';
    } else {
        console.log("Possible values of selectedLevelData:", selectedLevelData);

        const nextAI = bestChild.heaps - userValue;

        numberOfStones[currentHeapIndexAI] = nextAI;

        if (isGameOver()) {
            alert('Game Over! AI Win!');
            return;
        }

        const parsedNextAI = parseInt(nextAI);
        const clickedNodeAI = new Node(parsedNextAI);

        const nextchildAI = alphaBeta(clickedNodeAI, depth - 1, alpha, beta, true);

        numberOfStones[0] = nextchildAI.heaps;

        createCh(1, nextchildAI.heaps);
        
        bestChild.heaps = nextchildAI.heaps;
    }
    
}



function isGameOver() {
    for (let i = 0; i < numberOfHeaps; i++) {
        if (numberOfStones[i] > 0) {
            return false;
        }
    }

    // if (userValue > numberOfStones[currentHeapIndexAI]) {
    //     alert('Invalid move! You tried to remove more stones than are available in the heap.');
    //     return true; 
    // }

    return true; 
}







function createGrandchildren(childDiv, number) {
    for (let j = 0; j < number; j++) {
        const grandchildDiv = document.createElement('div');
        grandchildDiv.className = 'grandchild';
        childDiv.appendChild(grandchildDiv);
        grandchildDiv.addEventListener('click', function () {
            grandchildDiv.style.backgroundColor = 'yellow';
        });
    }
}


class Node {
    constructor(heaps) {
        this.heaps = heaps;
    }
    getChildren() {
        const children = [];

        if (this.heaps >= 1) {
            children.push(new Node(this.heaps - 1));
        }
        if (this.heaps >= 2) {
            children.push(new Node(this.heaps - 2));
        }

        return children;
    }
    heuristicValue(maximizingPlayer) {
        if (this.isTerminalNode()) {
            if (maximizingPlayer) {
                return -1; // 
            } else if (!maximizingPlayer) {
                return 1; 
            } else {
                return 0; 
            }
        }
        return 0; 
    }

    isTerminalNode() {
        return (this.getChildren().length === 0);
    }
}


function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || node.isTerminalNode()) {
        return node.heuristicValue(maximizingPlayer);
    }

    let bestChild = null;

    if (maximizingPlayer) {
        let v = -Infinity;

        for (const child of node.getChildren()) {
            const childValue = alphaBeta(child, depth - 1, alpha, beta, false);

            if (childValue > v) {
                v = childValue;
                bestChild = child;
            }

            alpha = Math.max(alpha, v);

            if (beta <= alpha) {
                break;
            }
        }

        if (bestChild === null) {
            const children = node.getChildren();
            bestChild = children[Math.floor(Math.random() * children.length)];
        }

        node.heaps = bestChild.heaps;

        return bestChild;
    } else {
        let v = Infinity;

        for (const child of node.getChildren()) {
            const childValue = alphaBeta(child, depth - 1, alpha, beta, true);

            if (childValue < v) {
                v = childValue;
                bestChild = child;
            }

            beta = Math.min(beta, v);

            if (beta <= alpha) {
                break;
            }
        }

        if (bestChild === null) {
            const children = node.getChildren();
            bestChild = children[Math.floor(Math.random() * children.length)];
        }

        node.heaps = bestChild.heaps;

        return bestChild;
    }
}


getDataGame(); 
let parsedNext;


let depth;

let alpha = -Infinity;
let beta = Infinity;

node = new Node(numberOfStones[0]); // Set the initial node

if (selectedLevelData.toLowerCase() === "easy") {
    console.log("hello here easy");

    const aiMove = simulateEasyAIMove();
    const aiHeapIndex = aiMove.heap;
    const aiStonesToRemove = aiMove.stones;

    numberOfStones[aiHeapIndex] -= aiStonesToRemove;

    createCh(1, numberOfStones[aiHeapIndex]);

    const divToDisplay = document.querySelector('.inputs');
    divToDisplay.style.display = 'flex';
} else {
    console.log("Possible values of selectedLevelData:", selectedLevelData);

    depth = (selectedLevelData.toLowerCase() === "medium") ? 4 : 10;
    console.log(selectedLevelData.toLowerCase());

    bestChild = alphaBeta(node, depth, alpha, beta, true);
    createCh(1, bestChild.heaps);
}