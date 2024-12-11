let numberOfHeaps;
let numberOfStones;
let userData = getUserData();
let lastAIMove = null;
let nextChildAI = null;
let lastMoveChildren = null;

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
        if (Array.isArray(stones)) {

            for (let i = 0; i < stones.length; i++) {
                const childDiv = document.createElement('div');
                childDiv.className = 'childAc';

                buttonElement.addEventListener('click', buttonClickHandler);
                fatherElement.appendChild(childDiv);
                inputs.style.display = 'flex';


                createGrandchildren(childDiv, stones[i]);
            }
        } else {

            for (let i = 0; i < numberOfHeaps; i++) {
                const childDiv = document.createElement('div');
                childDiv.className = 'childAc';

                buttonElement.addEventListener('click', buttonClickHandler);
                fatherElement.appendChild(childDiv);
                inputs.style.display = 'flex';


                createGrandchildren(childDiv, stones);
            }
        }
    } else {
        console.error('Parent element with class "father" not found.');
    }
}



function buttonClickHandler(event) {
    const clickedButton = document.querySelector('.number');
    const userValues = clickedButton.value.split(',').map(Number);

    console.log(bestChild);

    if (!isValidUserMove(userValues)) {


        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter valid values!',
        });
        return;
    }




    for (let i = 0; i < userValues.length; i++) {
        const userChildDiv = document.createElement('div');
        userChildDiv.className = 'child';
        fatherElement.appendChild(userChildDiv);
        createGrandchildren(userChildDiv, userValues[i]);
    }


    const divToRemove = document.querySelector('.inputs');
    divToRemove.style.display = 'none';




    bestChild = userValues;

    console.log("bestchild", bestChild);

    if (isGameOver()) {

        alert('You Win!');
        return;
    }



    let clickedNodeAI = new NodeV2();
    clickedNodeAI.stones = []; // Initialize stones as an empty array


    for (let k = 0; k < userValues.length; k++) {
        clickedNodeAI.stones.push(userValues[k]);
    }

    console.log("node_user", clickedNodeAI);


    nextChildAI = alphaBeta(clickedNodeAI, depth - 1, alpha, beta, true);


    createCh(nextChildAI.stones.length, nextChildAI.stones);
    bestChild = nextChildAI;



    console.log("bestchild", bestChild);
    if (Array.isArray(bestChild.stones) && bestChild.stones.every(stone => stone === 1)) {
        console.log("bestchild", bestChild);

        alert('Game Over! AI Win!');
        return;
    }





}


function isValidUserMove(userValues) {
    console.log("bestChild", bestChild);
    console.log("bestChild.getChildren()", bestChild.getChildren());

    const lastMoveChildren = bestChild.getChildren();

    // Check if each child array is equal to userValues
    for (const child of lastMoveChildren) {
        if (arraysAreEqual(userValues, child.stones)) {
            return true;
        }
    }

    // If none of the children arrays match, return false
    return false;
}


function arraysAreEqual(arr1, arr2) {

    const sortedArr1 = arr1.slice().sort();//sorts elements as strings ,dictionary order
    const sortedArr2 = arr2.slice().sort();

    if (sortedArr1.length !== sortedArr2.length) {
        return false;
    }

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }

    return true;
}


function isGameOver() {
    if (Array.isArray(bestChild) && bestChild.every(stone => stone === 1))
        return true;
    else
        return false;


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





class NodeV2 {
    constructor(stones) {
        this.stones = stones;
    }

    getChildren() {
        const children = [];

        for (let i = 0; i < this.stones.length; i++) {
            if (this.stones[i] > 1) {
                for (let j = 1; j <= this.stones[i] - 1; j++) {
                    const newChildStones = [...this.stones];//spreads the elements of the array into a new array
                    newChildStones[i] -= j;
                    newChildStones.push(j);



                    children.push(new NodeV2(newChildStones));

                }
            }
        }

        return children;
    }
    heuristicValue(maximizingPlayer) {
        if (this.isTerminalNode()) {

            if (maximizingPlayer) {
                return -1;
            } else if (!maximizingPlayer) {
                return 1;
            }
            else
                return 0;

        }
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

        for (const child of node.getChildren()) {//random 
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

        // Update the number of stones based on the AI move
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



        return bestChild;
    }
}


let initialNodev2;

const initialStonesArray = [];

for (let k = 0; k < numberOfStones.length; k++) {
    initialStonesArray.push(numberOfStones[k]);
}
console.log(numberOfStones);

initialNodev2 = new NodeV2(initialStonesArray);

console.log("initialNodev2", initialNodev2);

// const initialNodev2 = new NodeV2([5, 2]);
const initialChildrenv2 = initialNodev2.getChildren();

for (const childNode of initialChildrenv2) {
    console.log(childNode);
}
let depth;
let bestChild;





let selectedLevelData = localStorage.getItem("selectedLevel");

if (selectedLevelData.toLowerCase() === "easy") {

    depth = 2;
} else if (selectedLevelData.toLowerCase() === "medium") {
    depth = 4;
} else if (selectedLevelData.toLowerCase() === "difficult") {
    depth = 10;
}
console.log(selectedLevelData.toLowerCase());

const alpha = -Infinity;
const beta = Infinity;



bestChild = alphaBeta(initialNodev2, depth, alpha, beta, true);


console.log(bestChild);
console.log(bestChild.stones);
console.log(bestChild.stones.length);




createCh(bestChild.stones.length, bestChild.stones);