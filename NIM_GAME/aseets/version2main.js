let numOfHeapsInput;
let numOfStonesInput;
let saveButton;
let level = false;
//Set User Name 
const storedName = localStorage.getItem("user_name");
const fatherElement = document.querySelector('.name');
const username = document.createElement('p');
username.className = 'name';
fatherElement.appendChild(username).innerHTML = storedName;


numOfHeapsInput = document.getElementById('input');
numOfStonesInput = document.getElementById('inputt');
console.log(numOfHeapsInput)
console.log(numOfStonesInput)
saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', saveData);
setLevel();

function saveData() {

    if (numOfHeapsInput && numOfStonesInput) {
        let numOfHeaps = numOfHeapsInput.value;
        let numOfStones = numOfStonesInput.value;

        // Create an object to store the data
        let data = {
            numberOfHeaps: numOfHeaps,
            numberOfStones: numOfStones
        };

        // Convert the data object to a JSON string
        let jsonData = JSON.stringify(data);

        // Store the JSON string in local storage
        localStorage.setItem('gameData', jsonData);
        if (level) {
            window.location.href = "./playVersion2.html";
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in all required fields.!",
            });
        }

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all required fields.!",
        });
    }
}


function setLevel() {
    let levelDivs = document.querySelectorAll('.levels div');
    // Add click event listeners to each div
    levelDivs.forEach(function (div) {
        div.addEventListener('click', function () {
            // Remove the "level-selected" class from all divs
            levelDivs.forEach(function (el) {
                el.classList.remove('level-selected');
            });

            // Add the "level-selected" class to the clicked div
            div.classList.add('level-selected');
            let selectedValue = div.textContent;
            level = saveDataa(selectedValue, numOfHeapsInput, numOfStonesInput);
        });
    });

}

function saveDataa(level, numOfHeapsInput, numOfStonesInput) {
    if (level && numOfStonesInput && numOfHeapsInput) {
        localStorage.setItem('selectedLevel', level);
        return true;
    }
    return false;
}



