const urlBase = 'http://smallcopproject.com';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener("DOMContentLoaded", function() {
    const logForm = document.getElementById("logForm");
    if (logForm) {
        logForm.addEventListener("submit", function(event) {
            event.preventDefault();
            doLogin();
        });
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            doSignup();
        });
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            doLogout();
        });
    }

    const signupUsername = document.getElementById("signup-username");
    if (signupUsername) {
        signupUsername.addEventListener("input", function() {
            checkUsernameComplexity(this.value);
        });
    }

    const signupPass = document.getElementById("signup-pass");
    if (signupPass) {
        signupPass.addEventListener("input", function() {
            checkPasswordComplexity(this.value, "signup-");
        });
    }

    const addContactForm = document.getElementById("addContactForm");
    if (addContactForm) {
        addContactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            addContact();
        });
    }

    const searchContactForm = document.getElementById("searchContactForm");
    if (searchContactForm) {
        searchContactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            searchContact();
        });
    }

    const removeContactForm = document.getElementById("removeContactForm");
    if (removeContactForm) {
        removeContactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            removeContact();
        });
    }

    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", function() {
        });
    }
});

let deleteContactId;

function deleteContact(contactId) {
    deleteContactId = contactId;
    showModal();
}

function showModal() {
    var modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];
    var confirmBtn = document.getElementById("confirmDelete");
    var cancelBtn = document.getElementById("cancelDelete");

    span.onclick = function() {
        modal.style.display = "none";
    }

    cancelBtn.onclick = function() {
        modal.style.display = "none";
    }

    confirmBtn.onclick = function() {
        modal.style.display = "none";
        confirmDeleteContact();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function confirmDeleteContact() {
    console.log(`Attempting to delete contactId: ${deleteContactId}`);

    let tmp = {
        id: deleteContactId,
        userId: getGlobalId()
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/deleteContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Server Response:", this.responseText);
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        console.log("Error from server: ", jsonObject.error);
                        return;
                    }
                    console.log("Contact deleted successfully");
                    loadContacts(document.getElementById('searchText').value); // Reload contacts after deleting
                } else {
                    console.log("HTTP status code: ", this.status);
                }
            }
        };
        xhr.onerror = function() {
            console.log("Request error: ", xhr.statusText);
        };
        console.log("Sending payload: ", jsonPayload); // Debugging line
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

function checkUsernameComplexity(username) {
    const minLength = 3;
    const maxLength = 11;
    const hasLetter = /[A-Za-z]/;

    let length = document.getElementById("username-length");
    let letter = document.getElementById("username-letter");

    if (length && letter) {
        if (username.length >= minLength && username.length <= maxLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }

        if (hasLetter.test(username)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        } else {
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }
    }
}

function checkPasswordComplexity(password, prefix) {
    const minLength = 8;
    const maxLength = 24;
    const hasNumber = /\d/;
    const hasLetter = /[A-Za-z]/;
    const hasSpecialChar = /[!@#$%^&*]/;

    let length = document.getElementById(prefix + "length");
    let number = document.getElementById(prefix + "number");
    let letter = document.getElementById(prefix + "letter");
    let special = document.getElementById(prefix + "special");

    if (length && number && letter && special) {
        if (password.length >= minLength && password.length <= maxLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }

        if (hasNumber.test(password)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
        } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
        }

        if (hasLetter.test(password)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        } else {
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }

        if (hasSpecialChar.test(password)) {
            special.classList.remove("invalid");
            special.classList.add("valid");
        } else {
            special.classList.remove("valid");
            special.classList.add("invalid");
        }
    }
}

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
    var hash = md5(password);

    console.log("Login:", login);
    console.log("Hashed Password:", hash);

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login: login, password: hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                saveGlobalId(userId);
                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "home.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doSignup() {
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let login = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-pass").value;
    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {firstName: firstname, lastName: lastname, login: login, password: hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("signupResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("signupResult").innerHTML = "User has been successfully registered!";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        alert("Enter a first name");
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        alert("Enter a last name");
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        alert("Enter a phone number");
        console.log("PHONE IS BLANK");  
    }
    else {
        var regex = /^\d{3}-\d{3}-\d{4}$/;

        if (regex.test(phone) == false) {
            alert("Enter a valid phone number");
            console.log("PHONE IS NOT VALID");
        }
        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }
    if (email == "") {
        alert("Enter an email address");
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if (regex.test(email) == false) {
            alert("Enter a valid email address")
            console.log("EMAIL IS NOT VALID");
        }
        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }
    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;
    }
    return true;
}

function addContact() {
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let phoneNumber = document.getElementById("phone").value;
    let emailAddress = document.getElementById("email").value; 

    if (!validAddContact(firstName, lastName, phoneNumber, emailAddress)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }

    console.log("First Name: ", firstName);
    console.log("Last Name: ", lastName);
    console.log("Phone Number: ", phoneNumber);
    console.log("Email Address: ", emailAddress);

    let tmp = {firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, emailAddress: emailAddress, userId: getGlobalId()}; 
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/addContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log("Error from server: ", jsonObject.error);
                } else {
                    console.log("Contact added successfully");
                    document.getElementById("addContactForm").reset();
                }

                let contactsTableBody = document.getElementById("contacts-table-body");
                if (contactsTableBody) {
                    console.log("Updating contacts table body");
                    loadContacts();
                } else {
                    console.log("Element 'contacts-table-body' not found");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}


function searchContact() {
    let srch = document.getElementById("searchText").value;
    let contactList = "";

    let tmp = {search: srch, userId: getGlobalId()};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/searchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log("Error from server: ", jsonObject.error);
                    return;
                }

                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += "<tr>";
                    contactList += "<td>" + jsonObject.results[i].FirstName + "</td>";
                    contactList += "<td>" + jsonObject.results[i].LastName + "</td>";
                    contactList += "<td>" + jsonObject.results[i].EmailAddress + "</td>";
                    contactList += "<td>" + jsonObject.results[i].PhoneNumber + "</td>";
                    contactList += "<td>" +
                        "<button onclick='editContact(" + jsonObject.results[i].ID + ")'><i class='fa fa-edit'></i></button>" +
                        "<button onclick='deleteContact(" + jsonObject.results[i].ID + ")'><i class='fa fa-trash'></i></button>" +
                        "</td>";
                    contactList += "</tr>";
                }

                let contactsTableBody = document.getElementById("contacts-table-body");
                if (contactsTableBody) {
                    contactsTableBody.innerHTML = contactList;
                } else {
                    console.log("Element 'contacts-table-body' not found");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

function getGlobalId() {
    return localStorage.getItem('globalId');
}

function saveGlobalId(Id) {
    console.log("globalId saved as:" + Id);
    localStorage.setItem('globalId', Id);
}

function loadContacts(searchText = "") {
    let tmp = {
        search: searchText,
        userId: getGlobalId()
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/searchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log("Error from server: ", jsonObject.error);
                    return;
                }
                let contactList = "";
                let results = jsonObject.results; 
                results.sort((a, b) => a.FirstName.localeCompare(b.FirstName));

                for (let i = 0; i < jsonObject.results.length; i++) {
                    console.log(`Contact ID: ${jsonObject.results[i].ID}`); // Log contact IDs
                    contactList += `<tr data-contact-id='${jsonObject.results[i].ID}'>`;
                    contactList += `<td>${jsonObject.results[i].FirstName}</td>`;
                    contactList += `<td>${jsonObject.results[i].LastName}</td>`;
                    contactList += `<td>${jsonObject.results[i].EmailAddress}</td>`;
                    contactList += `<td>${jsonObject.results[i].PhoneNumber}</td>`;
                    contactList += `<td>
                        <button onclick='editContact(${jsonObject.results[i].ID})'><i class='fa fa-edit'></i></button>
                        <button onclick='deleteContact(${jsonObject.results[i].ID})'><i class='fa fa-trash'></i></button>
                    </td>`;
                    contactList += `</tr>`;
                }
                let contactsTableBody = document.getElementById("contacts-table-body");
                if (contactsTableBody) {
                    console.log("Updating contacts-table-body with contacts");
                    contactsTableBody.innerHTML = contactList;
                    verifyContactIds(); // Verify the contact IDs after updating the table
                } else {
                    console.log("Element 'contacts-table-body' not found in loadContacts");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

function verifyContactIds() {
    let rows = document.querySelectorAll("tr[data-contact-id]");
    if (rows.length === 0) {
        console.log("No rows with data-contact-id found.");
    } else {
        rows.forEach(row => {
            console.log(`Row with data-contact-id: ${row.getAttribute('data-contact-id')}`);
        });
    }
}

function editContact(contactId) {
    console.log(`Attempting to edit contactId: ${contactId}`);
    let row = document.querySelector(`tr[data-contact-id='${contactId}']`);
    if (!row) {
        console.log(`Row not found for contactId: ${contactId}`);
        return;
    }

    let cells = row.cells;
    let firstNameCell = cells[0];
    let lastNameCell = cells[1];
    let emailCell = cells[2];
    let phoneCell = cells[3];
    let actionsCell = cells[4];

    let firstName = firstNameCell.textContent;
    let lastName = lastNameCell.textContent;
    let email = emailCell.textContent;
    let phone = phoneCell.textContent;

    firstNameCell.innerHTML = `<input type='text' id='editFirstName${contactId}' value='${firstName}'>`;
    lastNameCell.innerHTML = `<input type='text' id='editLastName${contactId}' value='${lastName}'>`;
    emailCell.innerHTML = `<input type='text' id='editEmail${contactId}' value='${email}'>`;
    phoneCell.innerHTML = `<input type='text' id='editPhone${contactId}' value='${phone}'>`;

    actionsCell.innerHTML = `<button onclick='saveContact(${contactId})'><i class='fa fa-save'></i></button>`;
}

function saveContact(contactId) {
    let firstName = document.getElementById(`editFirstName${contactId}`).value;
    let lastName = document.getElementById(`editLastName${contactId}`).value;
    let email = document.getElementById(`editEmail${contactId}`).value;
    let phone = document.getElementById(`editPhone${contactId}`).value;

    console.log(`Saving contactId: ${contactId}, FirstName: ${firstName}, LastName: ${lastName}, Email: ${email}, Phone: ${phone}`);

    let tmp = {
        id: contactId,
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        phoneNumber: phone
    };

    // Ensure the payload contains the contactId and fields to update
    if (!contactId || (!firstName && !lastName && !email && !phone)) {
        console.log("Error: Missing required fields");
        return;
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/editContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Server Response:", this.responseText);
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        console.log("Error from server: ", jsonObject.error);
                        return;
                    }
                    console.log("Contact edited successfully");
                    loadContacts(document.getElementById('searchText').value); // Reload contacts after editing
                } else {
                    console.log("HTTP status code: ", this.status);
                }
            }
        };
        xhr.onerror = function() {
            console.log("Request error: ", xhr.statusText);
        };
        console.log("Sending payload: ", jsonPayload); // Debugging line
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}


function deleteContact(contactId) {
    deleteContactId = contactId;
    showModal();
}

function showModal() {
    var modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];
    var confirmBtn = document.getElementById("confirmDelete");
    var cancelBtn = document.getElementById("cancelDelete");

    span.onclick = function() {
        modal.style.display = "none";
    }

    cancelBtn.onclick = function() {
        modal.style.display = "none";
    }

    confirmBtn.onclick = function() {
        modal.style.display = "none";
        confirmDeleteContact();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function confirmDeleteContact() {
    console.log(`Attempting to delete contactId: ${deleteContactId}`);

    let tmp = {
        id: deleteContactId,
        userId: getGlobalId()
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/deleteContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Server Response:", this.responseText);
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        console.log("Error from server: ", jsonObject.error);
                        return;
                    }
                    console.log("Contact deleted successfully");
                    loadContacts(document.getElementById('searchText').value); // Reload contacts after deleting
                } else {
                    console.log("HTTP status code: ", this.status);
                }
            }
        };
        xhr.onerror = function() {
            console.log("Request error: ", xhr.statusText);
        };
        console.log("Sending payload: ", jsonPayload); // Debugging line
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

function getGlobalId() {
    return localStorage.getItem('globalId');
}

function searchContact() {
    let searchText = document.getElementById('searchText').value;
    loadContacts(searchText);
}
