
const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const userList = document.querySelector("#users-list");

let users = [];

function displayUsers(userData) {
    userList.innerHTML = "";

    userData.forEach(function (user) {
        const listItem = document.createElement("li");
        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = user.email;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const companyName = document.createElement("p");
        companyName.textContent = user.company.name;

        listItem.appendChild(name);
        listItem.appendChild(email);
        listItem.appendChild(city);
        listItem.appendChild(companyName);

        userList.appendChild(listItem);
    });
}

async function loadUsers() {
    loadButton.disabled = true;
    statusText.textContent = "Loading users...";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Failed to load users");
        }

        users = await response.json();
        displayUsers(users);
        statusText.textContent = "Users loaded";
    } catch (error) {
        statusText.textContent = error.message;
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", function () {
    const searchText = filterInput.value.toLowerCase();

    const filteredUsers = users.filter(function (user) {
        const userName = user.name.toLowerCase();
        return userName.includes(searchText);
    });

    displayUsers(filteredUsers);
});
