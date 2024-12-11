// Function to get the name from the input field
function getName() {
    const name = document.getElementById("input").value;
    return name;
}

// Function to save the name to localStorage
function saveNameToLocalStorage(key, name) {
    localStorage.setItem(key, name);
}

// Function to handle anchor click events
function handleAnchorClick(event) {
    event.preventDefault();
    const name = getName();
    saveNameToLocalStorage("user_name", name);
    const currentAnchor = event.target; // Get the clicked anchor element
    const anchorContent = currentAnchor.innerHTML; // Get the content of the clicked anchor
    if(anchorContent == "Version 1"){
        window.location.href = "./thirdPage.html";
    }else{
        window.location.href = "./version2.html";
    }
}

function addClickListenersToAnchors() {
    clearLocalStorage();
    const anchorElements = document.querySelectorAll(".Versions a");
    anchorElements.forEach(function (currentAnchor) {
        currentAnchor.addEventListener("click", handleAnchorClick);
    });
}
function clearLocalStorage() {
    localStorage.clear();
}
addClickListenersToAnchors();