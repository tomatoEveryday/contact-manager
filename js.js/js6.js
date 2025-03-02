const urlBase = 'http://cosmiccontacts.net/LAMPAPI';
const extension = 'php';

let ID = 0;
let USER = "";
const contactIds = [];
let previousTableContent = "";

function storeID(ID)
{
    localStorage.setItem('storedID', ID);
}
function getStoredID()
{
    return localStorage.getItem('storedID');
}

function login()
{
    document.getElementById('loginResult').innerHTML = "";

    let userName = document.getElementById("loginName").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    var hash = md5(password);
    ID = 0;
    let jsonPayload = JSON.stringify({userName:userName,password:hash});
    let url = urlBase + '/Login.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState === 4)
        {
            if (this.status === 200)
            {
                let response = JSON.parse(xhr.responseText);
                ID = response.userId;
                USER = response.userName;
                storeID(ID);
                saveCookie();
                window.location.href = "contacts.html";
            }
            else if (this.status === 401)
            {
                document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
            }
            else
            {
                document.getElementById("loginResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };
    xhr.send(jsonPayload);
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "ID=" + ID + ",USER=" + USER + ";expires=" + date.toGMTString();
}

function readCookie()
{
	ID = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if(tokens[0] == "USER")
		{
			USER = tokens[1];
		}
		else if(tokens[0] == "ID")
		{
			ID = parseInt(tokens[1].trim());
		}
	}

	if(ID < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
        document.getElementById("userName").innerHTML = "USER: " + USER;
	}
}

function showHint(hintId)
{
    var hints = document.querySelectorAll('.hint-text');
    hints.forEach(function (hint) { hint.style.display = 'none'; });
    document.getElementById(hintId).style.display = 'block';
}

function checkFirstName()
{
    var firstName = document.getElementById("firstName").value.trim();
    if (firstName != "" && document.getElementById("firstNameHint").style.display !== 'none')
        document.getElementById("firstNameHint").style.display = 'none';
}

function checkLastName()
{
    var lastName = document.getElementById("lastName").value.trim();
    if (lastName != "" && document.getElementById("lastNameHint").style.display !== 'none')
        document.getElementById("lastNameHint").style.display = 'none';
}

function checkUserName()
{
    var userName = document.getElementById("userName").value.trim();
    if (/[a-zA-Z]/.test(userName) === true && document.getElementById("letterHint").style.display !== 'none')
        document.getElementById("letterHint").style.display = 'none';
    if (/\d/.test(userName) === true && document.getElementById("digitHint").style.display !== 'none')
        document.getElementById("digitHint").style.display = 'none';
    if (userName.length >= 4 && userName.length <= 16 && document.getElementById("lengthHint").style.display !== 'none')
        document.getElementById("lengthHint").style.display = 'none';
}

function checkPassword()
{
    var password = document.getElementById("password").value.trim();
    if (/[a-zA-Z]/.test(password) === true && document.getElementById("passLetterHint").style.display !== 'none')
        document.getElementById("passLetterHint").style.display = 'none';
    if (/\d/.test(password) === true && document.getElementById("passDigitHint").style.display !== 'none')
        document.getElementById("passDigitHint").style.display = 'none';
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) === true && document.getElementById("passSpecialHint").style.display !== 'none')
        document.getElementById("passSpecialHint").style.display = 'none';
    if (password.length >= 4 && password.length <= 16 && document.getElementById("passLengthHint").style.display !== 'none')
        document.getElementById("passLengthHint").style.display = 'none';
}

function register()
{
    document.getElementById("registerResult").innerHTML = "";

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let userName = document.getElementById("userName").value.trim();
    let password = document.getElementById("password").value.trim();
    var hash = md5(password);
    var validity = true;
    
    if (firstName == "")
    {
        validity = false;
    }
    if (lastName == "")
    {
        validity = false;
    }
    
    var regex = /^(?=.*\d)(?=.*[a-zA-Z]).{4,16}$/;
    if (regex.test(userName) == false)
    {
        validity = false;
    }

    var regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{4,16}$/;
    if (regex.test(password) == false)
    {
        validity = false;
    }

    if (!validity)
    {
        document.getElementById("registerResult").innerHTML = "INVALID INPUT(S)";
        return;
    }

    let jsonPayload = JSON.stringify({firstName:firstName,lastName:lastName,userName:userName,password:hash});
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState === 4) 
        {
            if (this.status === 200)
            {
                document.getElementById("registerResult").innerHTML = "User added";
                window.location.href="index.html";
            }
            else if (this.status == 409)
            {
                document.getElementById("registerResult").innerHTML = "Username Taken";
            }
            else
            {
                document.getElementById("registerResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };
    xhr.send(jsonPayload);
}

function logout()
{
    ID = 0;
    USER = "";
    document.cookie = "USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function checkPhoneNumber()
{
    var phoneNumber = document.getElementById("phoneNumber").value.trim();
    if (/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber) === true && document.getElementById("phoneNumberHint").style.display !== 'none')
        document.getElementById("phoneNumberHint").style.display = 'none';
}

function checkEmailAddress()
{
    var emailAddress = document.getElementById("emailAddress").value.trim();
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(emailAddress) === true && document.getElementById("emailAddressHint").style.display !== 'none')
        document.getElementById("emailAddressHint").style.display = 'none';
}

function addContact()
{
    document.getElementById('addResult').innerHTML = "";

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let emailAddress = document.getElementById("emailAddress").value.trim();
    let validity = true;

    if (firstName == "")
    {
        validity = false;
    }

    if (lastName == "")
    {
        validity = false;
    }

    var regex = /^\d{3}-\d{3}-\d{4}$/;
    if (regex.test(phoneNumber) == false)
    {
        validity = false;
    }

    var regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (regex.test(emailAddress) == false)
    {
        validity = false;
    }

    if (!validity)
    {
        document.getElementById("addResult").innerHTML = "INVALID INPUT(S)";
        return;
    }

    let jsonPayload = JSON.stringify({
        firstName:firstName,
        lastName:lastName,
        phoneNumber:phoneNumber
        ,emailAddress:emailAddress,
        userId:getStoredID()
    });

    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            document.getElementById("addContactForm").style.display = "none";
            document.getElementById("contacts").style.display = "block";
            document.getElementById("searchForm").style.display = "block";
        }
    };
    xhr.send(jsonPayload);
}

function showAddForm()
{
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailAddress").value = "";
    document.getElementById("addResult").innerHTML = "";

    previousTableContent = document.getElementById("contacts").innerHTML;
    document.getElementById("contacts").style.display = "none";
    document.getElementById("searchForm").style.display = "none";
    document.getElementById("addContactForm").style.display = "block";
}

function cancelAdd()
{
    document.getElementById('addResult').innerHTML = "";

    document.getElementById("contacts").innerHTML = "";
    document.getElementById("contacts").innerHTML = previousTableContent;
    document.getElementById("contacts").style.display = "block";
    document.getElementById("searchForm").style.display = "block";
    document.getElementById("addContactForm").style.display = "none";
}

function searchContacts()
{
    let jsonPayload = JSON.stringify({search:document.getElementById("searchInput").value.trim(),userId:getStoredID()});
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            let response = JSON.parse(xhr.responseText);
            let tableBody = "";
            if (response.searchResults.length < 1)
            {
                document.getElementById("tbody").innerHTML = "";
                return;
            }
            tableBody += `<tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email Address</th><th>Action</th></tr>`;
            for (let i = 0; i < response.searchResults.length; i++)
            {
                let contact = response.searchResults[i];
                tableBody += `<tr id='row${i}'>
                    <td id='firstName${i}'>${contact.firstName}</td>
                    <td id='lastName${i}'>${contact.lastName}</td>
                    <td id='phoneNumber${i}'>${contact.phoneNumber}</td>
                    <td id='emailAddress${i}'>${contact.emailAddress}</td>
                    <td>
                        <button class='button' id='edit${i}' onclick='editContact(${contact.ID}, ${i})'>EDIT</button>
                        <button class='button' id='save${i}' onclick='updateContact(${contact.ID}, ${i})' style='display: none'>SAVE</button>
                        <button class='button' id='delete${i}' onclick='deleteContact(${contact.ID}, ${i})'>DELETE</button>
                    </td>
                </tr>`;
            }
            document.getElementById("tbody").innerHTML = tableBody;
        }
    };
    xhr.send(jsonPayload);
}

function editContact(contactId, index)
{
    let row = document.getElementById(`row${index}`);
    let cells = row.getElementsByTagName('td');

    for (let i = 0; i < cells.length - 1; i++)
    {
        let cell = cells[i];
        let cellContent = cell.textContent.trim();

        let input = document.createElement('input');
        input.type = 'text';
        input.value = cellContent;

        cell.innerHTML = '';
        cell.appendChild(input);
    }

    let editButton = document.getElementById(`edit${index}`);
    editButton.textContent = 'SAVE';
    editButton.setAttribute('onclick', `updateContact(${contactId}, ${index})`);

    let deleteButton = document.getElementById(`delete${index}`);
    deleteButton.textContent = 'CANCEL';
    deleteButton.setAttribute('onclick', `cancelEdit(${contactId}, ${index})`);
}

function updateContact(contactId, index)
{
    let row = document.getElementById(`row${index}`);
    let cells = row.getElementsByTagName('td');

    let jsonPayload = JSON.stringify({
        firstName: cells[0].querySelector('input').value.trim(),
        lastName: cells[1].querySelector('input').value.trim(),
        phoneNumber: cells[2].querySelector('input').value.trim(),
        emailAddress: cells[3].querySelector('input').value.trim(),
        updateId: contactId
    });
    let url = urlBase + '/UpdateContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            for (let i = 0; i < cells.length - 1; i++)
            {
                let cell = cells[i];
                cell.innerHTML = cells[i].querySelector('input').value;
            }

            let editButton = document.getElementById(`edit${index}`);
            editButton.textContent = 'EDIT';
            editButton.setAttribute('onclick', `editContact(${contactId}, ${index})`);

            let deleteButton = document.getElementById(`delete${index}`);
            deleteButton.textContent = 'DELETE';
            deleteButton.setAttribute('onclick', `deleteContact(${contactId}, ${index})`);
        }
    }
    xhr.send(jsonPayload);
}

function cancelEdit(contactId, index)
{
    let row = document.getElementById(`row${index}`);
    let cells = row.getElementsByTagName('td');
    
    for (let i = 0; i < cells.length - 1; i++)
    {
        let cell = cells[i];
        let cellContent = cell.querySelector('input').value;
        cell.innerHTML = cellContent;
    }

    let editButton = document.getElementById(`edit${index}`);
    editButton.textContent = 'EDIT';
    editButton.setAttribute('onclick', `editContact(${contactId}, ${index})`);

    let deleteButton = document.getElementById(`delete${index}`);
    deleteButton.textContent = 'DELETE';
    deleteButton.setAttribute('onclick', `deleteContact(${contactId}, ${index})`);
}

function deleteContact(contactId, index)
{
    if (confirm("Are you sure you want to delete this contact?"))
    {
        let jsonPayload = JSON.stringify({deleteId: contactId});
        let url = urlBase + '/DeleteContact.' + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let row = document.getElementById(`row${index}`);
                row.remove();
            }
        };
        xhr.send(jsonPayload);
    }
}
