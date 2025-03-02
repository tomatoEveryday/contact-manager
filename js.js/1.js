function login() {

    let username = document.getElementById("loginUsernameInput").value;
    let password = document.getElementById("loginPasswordInput").value;

    try {

        let payload = JSON.stringify({
            username: username,
            password: password
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "api/login.php", true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {

            if (this.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (this.status == 200) {
                window.location.href = "dashboard.html";
            } else if (this.status == 401) {
                window.alert("Error: Authentification failed! Correct your username and password.");
            } else {
                window.alert(`Error: (${this.status}) ${this.statusText}`);
            }
        };

        xhr.send(payload);

    } catch (e) {window.alert(`Error: ${e.message}`);}
}
function register() {

    let username = document.getElementById("registerUsernameInput").value;
    let password = document.getElementById("registerPasswordInput").value;
    let firstname = document.getElementById("registerFirstnameInput").value;
    let lastname = document.getElementById("registerLastnameInput").value;
    let phone = document.getElementById("registerPhoneInput").value;
    let hours = document.getElementById("registerHoursInput").value;
    let address = document.getElementById("registerAddressInput").value;
    let parentFirstname = document.getElementById("registerParentFirstnameInput").value;
    let parentLastname = document.getElementById("registerParentLastnameInput").value;
    let parentAge = document.getElementById("registerParentAgeInput").value;
    let parentAddress = document.getElementById("registerParentAddressInput").value;

    try {

        let payload = JSON.stringify({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            hours: hours,
            address: address,
            parentFirstname: parentFirstname,
            parentLastname: parentLastname,
            parentAge: parentAge,
            parentAddress: parentAddress
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "api/register.php", true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {

            if (this.readyState != XMLHttpRequest.DONE) {
                return;
            }
if (this.status == 200) {
                window.alert("You have successful registered!");
            } else if (this.status == 409) {
                window.alert("Error: Username already taken.");
            } else {
                window.alert(`Error: (${this.status}) ${this.statusText}`);
            }
        };

        xhr.send(payload);

    } catch (e) {window.alert(`Error: ${e.message}`);}
}

function populateMemberInfo() {

    try {

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "api/get_member_info.php", true);

        xhr.onreadystatechange = function () {

            if (this.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (this.status == 200) {

                try {

                    let json = JSON.parse(xhr.responseText);
document.getElementById("updateUsernameInput").value = json.username;
                    document.getElementById("updatePasswordInput").value = json.password;
                    document.getElementById("updateFirstnameInput").value = json.firstname;
                    document.getElementById("updateLastnameInput").value = json.lastname;
                    document.getElementById("updatePhoneInput").value = json.phone;
                    document.getElementById("updateHoursInput").value = json.hours;
                    document.getElementById("updateAddressInput").value = json.address;
                    document.getElementById("updateParentFirstnameInput").value = json.parentFirstname;
                    document.getElementById("updateParentLastnameInput").value = json.parentLastname;
                    document.getElementById("updateParentAgeInput").value = json.parentAge;
                    document.getElementById("updateParentAddressInput").value = json.parentAddress;

                } catch (e) {window.alert(`Error: ${e.message}`);}

            } else if (this.status == 401) {
                window.alert("Error: Authentification failed! Please re-login.");
            } else {
                window.alert(`Error: (${this.status}) ${this.statusText}`);
            }
        };

        xhr.send();

    } catch (e) {window.alert(`Error: ${e.message}`);}
}

function updateMemberInfo() {

    let username = document.getElementById("updateUsernameInput").value;
    let password = document.getElementById("updatePasswordInput").value;
    let firstname = document.getElementById("updateFirstnameInput").value;
    let lastname = document.getElementById("updateLastnameInput").value;
    let phone = document.getElementById("updatePhoneInput").value;
    let hours = document.getElementById("updateHoursInput").value;
    let address = document.getElementById("updateAddressInput").value;
let parentFirstname = document.getElementById("updateParentFirstnameInput").value;
    let parentLastname = document.getElementById("updateParentLastnameInput").value;
    let parentAge = document.getElementById("updateParentAgeInput").value;
    let parentAddress = document.getElementById("updateParentAddressInput").value;

    try {

        let payload = JSON.stringify({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            hours: hours,
            address: address,
            parentFirstname: parentFirstname,
            parentLastname: parentLastname,
            parentAge: parentAge,
            parentAddress: parentAddress
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "api/update_member_info.php", true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
xhr.onreadystatechange = function () {

            if (this.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (this.status == 200) {
                window.alert("Your information has been updated!");
            } else if (this.status == 401) {
                window.alert("Error: Authentification failed! Please re-login.");
            } else if (this.status == 409) {
                window.alert("Error: Username already taken.");
            } else {
                window.alert(`Error: (${this.status}) ${this.statusText}`);
            }
        };

        xhr.send(payload);

    } catch (e) {window.alert(`Error: ${e.message}`);}
}

function createContract() {
    let caregiverID = document.getElementById("caregiverID").value;
    let carereceiverID = document.getElementById("carereceiverID").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let hours = document.getElementById("hour").value;
    let medicalneeds = document.getElementById("medicalneeds").value;
    window.alert("Your contract has been created!");
}

function displayCookie() {
    document.getElementById("cookie").innerHTML = document.cookie;
}
function displayCookie() {
    document.getElementById("cookie").innerHTML = document.cookie;
}

function logout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

