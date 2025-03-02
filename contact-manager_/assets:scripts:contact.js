var curPage = 1;
var maxPage = 1;

// check to see if user exists.
function pageLoad() {
    let user = User.getInstance();

    // if a user is null, that means we don't have a login
    if (!user.isLoggedIn()) {
        console.log("User not logged in... redirecting to login page.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById('welcome-header-lbl').innerHTML = "Welcome, " + user.getFirstName() + "!";
    // show users.
    getContactPage(1);
}


function logUserOut() {
    User.getInstance().logOut();
    window.location.href = "index.html";
}


function showDeleteConfirmation(userID) {
    toggleDeletePopUp(userID);
}


function cancelDelete() {
    document.getElementById("deleteConfirmation").classList.add("hidden");
}

// delete contact goes here
async function deleteContact() {
    // alert("Contact deleted!"); 
    cancelDelete(); 
}

//shows add contact form
function addContact() {
    document.querySelector(".add-popup").classList.add("shown");
}


function cancelAddContact() {
    document.querySelector(".add-popup").classList.remove("shown");
}

function emailKeyTyped() {
    const email      = document.getElementById("newEmail").value;
    const emailError = document.getElementById("errorMessageEmail");
    if (isEmailFormatValid(email))
        emailError.style.display = "none";
    else
        emailError.style.display = "block";
        
}

function phoneKeyTyped() {
    const phone      = document.getElementById("newPhone").value;
    const phoneError = document.getElementById("errorMessagePhone");
    if (isValidPhoneNumber(phone))
        phoneError.style.display = "none";
    else
        phoneError.style.display = "block";
}

function isEmailFormatValid(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);  
}

function isValidPhoneNumber(phone) {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  }

/**
 * Adds a new contact to a user.
 * @returns Nothing
 */
async function saveNewContact() {
    const firstName = document.getElementById("newFirstName").value;
    const lastName = document.getElementById("newLastName").value;
    const phone = document.getElementById("newPhone").value;
    const email = document.getElementById("newEmail").value;

    
    if (!firstName) {
        document.querySelector('#errorMessageFirstName').style.display = 'block';
    } else {
        document.querySelector('#errorMessageFirstName').style.display = 'none';
    }

    if (!lastName) {
        document.querySelector('#errorMessageLastName').style.display = 'block';
    } else {
        document.querySelector('#errorMessageLastName').style.display = 'none';
    }

    if (!isEmailFormatValid(email)) {
        document.querySelector('#errorMessageEmail').style.display = 'block';
    } else {
        document.querySelector('#errorMessageEmail').style.display = 'none';
    }

    if (!isValidPhoneNumber(phone)) {
        document.querySelector('#errorMessagePhone').style.display = 'block';
    } else {
        document.querySelector('#errorMessagePhone').style.display = 'none';
    }

    if (!firstName || !lastName || !isEmailFormatValid(email) || !isValidPhoneNumber(phone)) {
        return;
    }


    const result = User.getInstance().addContact(firstName,lastName,phone,email);
    if (result) {
        console.log("Added contact") 
        cancelAddContact();
        
        document.querySelector('#newFirstName').value = "";
        document.querySelector('#newLastName').value = "";
        document.querySelector('#newPhone').value = "";
        document.querySelector('#newEmail').value = "";

        setTimeout(() => {
            searchContact();
        }, 100);
    } else {
        console.error("Unable to add contact!")
    }
}

var clickCount = 0;
function doToadSecret(id) {
    // toad is user id 0
    if (id != 0 || clickCount > 5) {
        clickCount = 0;
        return;
    }
    if (++clickCount != 5)
        return
    var audio = new Audio('./assets/img/Toad.mp3');
    audio.play();
}

const contactCodeBlock = (contact) => {
    const firstName = contact["FirstName"];
    const lastName  = contact["LastName"];
    const phone     = contact["Phone"];
    const email     = contact["Email"];
    const UserID    = contact["UserID"];
    return `
    <div class="contact-card-wrapper">
        <div class="contact-card-container">
            <div class="contact-card" data-userid=${UserID}>
                <div class="contact-avatar-container">
                    <img onClick="doToadSecret(` + UserID % 10 + `)" src="./assets/img/contact_profile_` + UserID % 10 + `.png" alt="Contact Avatar" class="contact-avatar">
                </div>
                <div class="contact-info">
                    <div class="form-group">
                        <label for="contactFirstName` + UserID + `" value="` + firstName + `">First Name:</label>
                        <input class="editFirstName" id="contactFirstName` + UserID + `" value="` + firstName + `" disabled value="">
                    </div>
                    <p class="form-error edit-form-error" id="editFirstName">Please enter first name</p>
                    <div class="form-group">
                        <label for="contactLastName` + UserID + `" value="` + lastName + `">Last Name:</label>
                        <input class="editLastName" type="text" id="contactLastName` + UserID + `" value="` + lastName + `" disabled value="">
                    </div>
                    <p class="form-error edit-form-error" id="editLastName">Please enter last name</p>
                    <div class="form-group">
                        <label for="contactPhone` + UserID + `" value="` + phone + `">Phone:</label>
                        <input class="editPhone" type="text" id="contactPhone` + UserID + `" value="` + phone + `" disabled value="">
                    </div>
                    <p class="form-error edit-form-error" id="editPhone">Phone format must follow: 123-123-1234</p>
                    <div class="form-group">
                        <label for="contactEmail` + UserID + `" value="` + email + `">Email:</label>
                        <input class="editEmail" type="text" id="contactEmail` + UserID + `" value="` + email + `" disabled value="">
                    </div>
                    <p class="form-error edit-form-error" id="editEmail">Email format must follow: name@host.com</p>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="enableEditing(` + UserID + `)">✏️</button>
                    <button class="save-btn" onclick="saveContact(` + UserID + `)">💾</button>
                    <button class="delete-btn" onclick="showDeleteConfirmation(` + UserID + `)">🗑️</button>
                </div>
            </div>
        </div>
    </div>`;
}

const enableEditing = (index) => {
    const card = document.querySelector(`.contact-card[data-userid="${index}"]`)
    if (card === undefined) return;

    card.classList.add('active');
    const inputs = card.querySelectorAll('input');
    for (let input of inputs) {
        input.removeAttribute('disabled')
    }
}

const disableEditing = (card) => {
    card.classList.remove('active');
    const inputs = card.querySelectorAll('input');
    for (let input of inputs) {
        input.setAttribute('disabled', true);
    }
}

const updateContact = async (contactID, newFirst, newLast, newPhone, newEmail) => {

    await User.getInstance().updateContact(contactID, User.getInstance().getID(), newFirst, newLast, newPhone, newEmail).then((res) => {
        if (res.error != "" || res != "Contact updated successfully") {
            console.log(res.error);
        }
    })
}

function saveContact(id) {
    const card = document.querySelector(`.contact-card[data-userid="${id}"]`);
    if (card == undefined) return;
    const ID = id;
    const FirstName = card.querySelector('.editFirstName').value;
    const LastName = card.querySelector('.editLastName').value;
    const Phone = card.querySelector('.editPhone').value;
    const Email = card.querySelector('.editEmail').value;

    if (!FirstName) {
        card.querySelector("#editFirstName").classList.add('active')
    } else {
        card.querySelector("#editFirstName").classList.remove('active')
    }

    if (!LastName) {
        card.querySelector("#editLastName").classList.add('active')
    } else {
        card.querySelector("#editLastName").classList.remove('active')
    }

    if (!isValidPhoneNumber(Phone)) {
        card.querySelector("#editPhone").classList.add('active')
    } else {
        card.querySelector("#editPhone").classList.remove('active')
    }

    if (!isEmailFormatValid(Email)) {
        card.querySelector("#editEmail").classList.add('active')
    } else {
        card.querySelector("#editEmail").classList.remove('active')
    }

    if (!FirstName || !LastName || !isValidPhoneNumber(Phone) || !isEmailFormatValid(Email)) {
        return;
    }

    updateContact(ID, FirstName, LastName, Phone, Email);
    disableEditing(card);
    setTimeout(() => {
        getContactPage(curPage);
    }, 100)
}

/**
 * Gets a page of contacts from the user
 * @param {Integer} pageNum Page to get.
 */
async function getContactPage(pageNum) {

    await User.getInstance().getContactPage(pageNum).then((res) => {
        // check to see if we got a valid response.
        const contactList = (res === null || res.error != '') ? [] : res.results;
        const table = document.getElementById("loadedContacts");
        var codeBlock = "";
        for (var i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            codeBlock    += contactCodeBlock(contact); 
        }
        // update contacts.
        table.innerHTML = codeBlock;

        // update max page.
        if (pageNum === 1)
            updateMaxPage((contactList.length === 0) ? 1 : res.totalPages);
    });
}

/**
 * Function to handle page increment
 */
function incrementPage() {
    const decBtn = document.getElementById("prevPageBtn");
    const incBtn = document.getElementById("nextPageBtn");

    // shouldn't happen
    if (curPage === maxPage)
        return;

    decBtn.classList.add("active");
    if (++curPage === maxPage) 
        incBtn.classList.remove("active");

    updateCurPageNum();
    setTimeout(() => {
        getContactPage(curPage);
    }, 100);
}

/**
 * Handles page decrement.
 */
function decrementPage() {

    // shouldn't happen.
    if (curPage === 1)
        return;

    const decBtn = document.getElementById("prevPageBtn");
    const incBtn = document.getElementById("nextPageBtn");

    if (--curPage === 1) {
        decBtn.classList.remove("active");
        incBtn.classList.add("active");
    }
    
    updateCurPageNum();
    setTimeout(() => {
        getContactPage(curPage);
    }, 100);
}

/**
 * Sets max page
 * @param {Integer} maxPage  max page
 */
function updateMaxPage(maxPage) {
    curPage = 1;
    this.maxPage = maxPage;

    const decBtn = document.getElementById("prevPageBtn");
    const incBtn = document.getElementById("nextPageBtn");

    if (curPage === maxPage) {
        decBtn.classList.remove("active");
        incBtn.classList.remove("active");
    }
}

function updateCurPageNum() {
    const curPageNum = document.getElementById("curPageNumTxt");
    curPageNum.innerHTML = curPage;
}

/**
 * Searches a user's contacts.
 */
async function searchContact() {
    const search = document.getElementById("searchInput").value;
    if (search === '') {
        curPage = 1;
        getContactPage(curPage);
        return;
    }

    await User.getInstance().searchContacts(search, 1).then((res) => {
        const contactList = (res === null || res.error != '') ? [] : res.results[0];
        const table = document.getElementById("loadedContacts");
        let codeBlock = "";
        for(var i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            codeBlock += contactCodeBlock(contact);
         }
         console.log(codeBlock)
         table.innerHTML = codeBlock;

        updateMaxPage((contactList.length === 0) ? 1 : res.totalPages);
    });
}

const toggleDeletePopUp = (userID) => {
    document.getElementById("deleteContactBtn").setAttribute("userID",userID);
    const popup = document.querySelector(".delete-popup");
    if (popup == undefined) return;

    popup.classList.toggle('shown')
}


/**
 * Deletes contact.
 * @returns Nothing
 */
function deleteContact() {
    const userID = (document.getElementById("deleteContactBtn").getAttribute("userid"));
    if (userID === '' || userID === -1)
        return;
    
    User.getInstance().deleteContact(userID).then((res) => {
        if (res.error === '') {
            console.log("Succesfully deleted contact with ID " + userID);
            return;
        } 
        console.error("Unable to delete contact with UserID " + userID + " error " + res.error);
    });
    
    toggleDeletePopUp(userID);
    setTimeout(() => {
        searchContact();
    }, 100);
}