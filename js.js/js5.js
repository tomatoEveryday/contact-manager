let urlBase = "";

if (window.location.href.includes("www")) {
	urlBase = `http://www.cop4331xutaocontactmanager.xyz/LAMPAPI`;
} else {
	urlBase = `http://cop4331xutaocontactmanager.xyz/LAMPAPI`;
}

const extension = "php";

let userId = 0;
let username = "";
let firstName = "";
let lastName = "";
let contactEntries;
let contactEntryBase;
let contactFormBase;
let currentContactToEdit = null;

function saveCookie() {
	let minutes = 60;
	let date = new Date();
	date.setTime(date.getTime() + minutes * 60 * 1000);
	document.cookie =
		"info=user," +
		"firstName=" +
		firstName +
		",lastName=" +
		lastName +
		",userId=" +
		userId +
		",username=" +
		username +
		";expires=" +
		date.toGMTString();
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
		} else if (tokens[0] == "username") {
			username = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	} else {
		document.getElementById(
			"userFullName"
		).innerHTML = `${firstName} ${lastName} (${username})`;
	}
}

// * ================ NAVIGATION ================

const switchToContactsPage = () => {
	window.location.href = "contacts.html";
};

const switchToContributorsPage = () => {
	window.location.href = "contributors.html";
};

// * ================ USERS ================

const validateSignUpFields = (firstName, lastName, username, password) => {
	const errors = [];

	// Validate first name
	if (firstName.length === 0) {
		errors.push("First name cannot be empty");
	} else if (firstName.length > 24) {
		errors.push("First name cannot be longer than 24 characters");
	}

	// Validate last name
	if (lastName.length === 0) {
		errors.push("Last name cannot be empty");
	} else if (lastName.length > 24) {
		errors.push("Last name cannot be longer than 24 characters");
	}

	// Validate username
	if (username.length <= 4) {
		errors.push("Username must be longer than 4 characters");
	} else if (username.length > 24) {
		errors.push("Username cannot be longer than 24 characters");
	}

	// Validate password
	if (password.length <= 7) {
		errors.push("Password must be longer than 7 characters");
	} else if (password.length > 24) {
		errors.push("Password cannot be longer than 24 characters");
	}

	return errors;
};

const signUp = () => {
	// Get add contact input values
	const firstNameValue = document
		.getElementById("signUpFirstName")
		.value.trim();
	const lastNameValue = document
		.getElementById("signUpLastName")
		.value.trim();
	const usernameValue = document
		.getElementById("signUpUsername")
		.value.trim();
	const passwordValue = document
		.getElementById("signUpPassword")
		.value.trim();

	// Trim input spaces
	document.getElementById("signUpFirstName").value = firstNameValue;
	document.getElementById("signUpLastName").value = lastNameValue;
	document.getElementById("signUpUsername").value = usernameValue;
	document.getElementById("signUpPassword").value = passwordValue;

	signUpErrors = validateSignUpFields(
		firstNameValue,
		lastNameValue,
		usernameValue,
		passwordValue
	);

	const signUpErrorsElement = document.getElementById("signUpErrors");
	signUpErrorsElement.innerHTML = "";

	// Display errors if error exists
	if (signUpErrors.length !== 0) {
		signUpErrors.forEach((error) => {
			signUpErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	let jsonPayload = JSON.stringify({
		firstName: firstNameValue,
		lastName: lastNameValue,
		username: usernameValue,
		password: passwordValue,
	});

	let url = urlBase + "/SignUp." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				window.location.href = "index.html";
			} else if (this.readyState == 4 && this.status == 409) {
				if (userId < 1) {
					document.getElementById(
						"signUpErrors"
					).innerHTML = `<li>Username already exist</li>`;
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

const validateLoginFields = (username, password) => {
	const errors = [];

	// Validate username
	if (username.length === 0) {
		errors.push("Username cannot be empty");
	}

	// Validate password
	if (password.length === 0) {
		errors.push("Password cannot be empty");
	}

	return errors;
};

const login = () => {
	// Get login input values
	const usernameValue = document.getElementById("loginUsername").value.trim();
	const passwordValue = document.getElementById("loginPassword").value.trim();

	loginErrors = validateLoginFields(usernameValue, passwordValue);

	const loginErrorsElement = document.getElementById("loginErrors");
	loginErrorsElement.innerHTML = "";

	// Display errors if error exists
	if (loginErrors.length !== 0) {
		loginErrors.forEach((error) => {
			loginErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// * Make login API call
	userId = 0;

	let jsonPayload = JSON.stringify({
		username: usernameValue,
		password: passwordValue,
	});

	let url = urlBase + "/Login." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				username = jsonObject.username;

				saveCookie();

				window.location.href = "contacts.html";
			} else if (this.readyState == 4 && this.status == 401) {
				if (userId < 1) {
					document.getElementById(
						"loginErrors"
					).innerHTML = `<li>Incorrect Username or Password</li>`;
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

const logout = () => {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
};

// * ================ CONTACTS ================

const resetAllFields = () => {
	document.getElementById("addContactFirstName").value = "";
	document.getElementById("addContactLastName").value = "";
	document.getElementById("addContactPhoneNumber").value = "";
	document.getElementById("addContactEmail").value = "";
	document.getElementById("addContactErrors").innerHTML = "";
	currentContactToEdit = null;
	resetSearch();
};

const searchContacts = () => {
	document.getElementById("contactEntries").innerHTML = "";
	const searchKeywordValue = document.querySelector("#search input").value;

	// * Make searchContacts API call
	let jsonPayload = JSON.stringify({
		searchKeyword: searchKeywordValue,
		userId: userId,
	});

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText).results;

				jsonObject.forEach((contactEntry) => {
					insertContact(
						contactEntry.id,
						contactEntry.name.split(" ")[0],
						contactEntry.name.split(" ")[1],
						contactEntry.phone,
						contactEntry.email
					);
				});
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

const resetSearch = () => {
	document.querySelector("#search input").value = "";

	searchContacts();
};

const initializeContactsPage = () => {
	contactEntries = document.getElementById("contactEntries");
	contactEntryBase = contactEntries
		.querySelector(".contact-entry")
		.cloneNode(true);
	contactEntries.querySelector(".contact-entry").remove();
	contactFormBase = document.getElementById("contactForm").cloneNode(true);
	searchContacts();
};

const validateContactFields = (firstName, lastName, phoneNumber, email) => {
	const errors = [];

	// Validate first name
	if (firstName.length === 0) {
		errors.push("First name cannot be empty");
	} else if (firstName.length > 24) {
		errors.push("First name cannot be longer than 24 characters");
	}

	// Validate last name
	if (lastName.length === 0) {
		errors.push("Last name cannot be empty");
	} else if (lastName.length > 24) {
		errors.push("Last name cannot be longer than 24 characters");
	}

	// Validate phone number
	if (phoneNumber.length === 0) {
		errors.push("Phone number cannot be empty");
	} else if (!phoneNumber.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
		errors.push("Please enter a valid 10-digit US phone number");
	}

	// Validate email
	if (email.length === 0) {
		errors.push("Email cannot be empty");
	} else if (
		!email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	) {
		errors.push("Please enter a valid email (example@email.com)");
	}

	return errors;
};

const addContact = () => {
	// Get add contact input values
	const firstNameValue = document
		.getElementById("addContactFirstName")
		.value.trim();
	const lastNameValue = document
		.getElementById("addContactLastName")
		.value.trim();
	const phoneNumberValue = document
		.getElementById("addContactPhoneNumber")
		.value.trim();
	const emailValue = document.getElementById("addContactEmail").value.trim();

	// Trim input spaces
	document.getElementById("addContactFirstName").value = firstNameValue;
	document.getElementById("addContactLastName").value = lastNameValue;
	document.getElementById("addContactPhoneNumber").value = phoneNumberValue;
	document.getElementById("addContactEmail").value = emailValue;

	const addContactErrors = validateContactFields(
		firstNameValue,
		lastNameValue,
		phoneNumberValue,
		emailValue
	);

	// Display errors if error exists
	if (addContactErrors.length !== 0) {
		const addContactErrorsElement =
			document.getElementById("addContactErrors");
		addContactErrorsElement.innerHTML = "";

		addContactErrors.forEach((error) => {
			addContactErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// * Make AddContact API call
	let jsonPayload = JSON.stringify({
		name: `${firstNameValue} ${lastNameValue}`,
		phone: convertPhoneNumberFormat(phoneNumberValue),
		email: emailValue,
		userId: userId,
	});

	let url = urlBase + "/AddContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				resetAllFields();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

const insertContact = (id, firstName, lastName, phoneNumber, email) => {
	const newContactEntry = contactEntryBase.cloneNode(true);

	const contactEntryInfo = newContactEntry.querySelector(
		".contact-entry-form .contact-entry-info"
	);
	// Remove existing <p> tags
	contactEntryInfo.innerHTML = "";

	// Add <p> tags with correct information
	contactEntryInfo.innerHTML += `<p>${firstName} ${lastName}</p>`;
	contactEntryInfo.innerHTML += `<p>${phoneNumber}</p>`;
	contactEntryInfo.innerHTML += `<p>${email}</p>`;

	// Set id
	newContactEntry.setAttribute("id", `id-${id}`);

	// Hide edit form
	newContactEntry.querySelector("#contactForm").style.display = "none";

	// Add new contact entry
	contactEntries.appendChild(newContactEntry);
};

const switchContactToEdit = (event) => {
	let foundContactEntry =
		event.target.parentElement.parentElement.parentElement;

	if (event.target.nodeName === "H3") {
		foundContactEntry = foundContactEntry.parentElement;
	}

	if (foundContactEntry.id === currentContactToEdit) {
		// Contact is currently being edit, close it
		currentContactToEdit = null;
		foundContactEntry.querySelector("#contactForm").style.display = "none";
	} else {
		// Edit a new contact, close all others
		currentContactToEdit = foundContactEntry.id;

		// Close all otherr contact edit form
		contactEntries
			.querySelectorAll(".contact-entry")
			.forEach((contactEntry) => {
				contactEntry.querySelector("#contactForm").style.display =
					"none";

				// Remove all errors
				contactEntry.querySelector(".field-errors").innerHTML = "";
			});

		// Open the selected contact edit form
		const selectedContactEntry = contactEntries.querySelector(
			`#${currentContactToEdit}`
		);

		selectedContactEntry.querySelector(`#contactForm`).style.display =
			"flex";

		// Popular edit form fields with existing data
		const editFormFields = contactEntries.querySelectorAll(
			`#${currentContactToEdit} .form-field`
		);

		const formData = selectedContactEntry.querySelectorAll(
			".contact-entry-info p"
		);

		editFormFields[0].querySelector("input").value =
			formData[0].innerHTML.split(" ")[0];
		editFormFields[1].querySelector("input").value =
			formData[0].innerHTML.split(" ")[1];
		editFormFields[2].querySelector("input").value = formData[1].innerHTML;
		editFormFields[3].querySelector("input").value = formData[2].innerHTML;
	}
};

const editContact = (event) => {
	const editContactFields = contactEntries.querySelectorAll(
		`#${currentContactToEdit} #contactForm .form-fields .form-field`
	);

	// Get add contact input values
	const firstNameField = editContactFields[0].querySelector("input");
	const lastNameField = editContactFields[1].querySelector("input");
	const phoneNumberField = editContactFields[2].querySelector("input");
	const emailField = editContactFields[3].querySelector("input");

	const firstNameValue = firstNameField.value.trim();
	const lastNameValue = lastNameField.value.trim();
	const phoneNumberValue = phoneNumberField.value.trim();
	const emailValue = emailField.value.trim();

	// Trim input spaces
	firstNameField.value = firstNameValue;
	lastNameField.value = lastNameValue;
	phoneNumberField.value = phoneNumberValue;
	emailField.value = emailValue;

	editContactErrors = validateContactFields(
		firstNameValue,
		lastNameValue,
		phoneNumberValue,
		emailValue
	);

	// Display errors if error exists
	if (editContactErrors.length !== 0) {
		const editContactErrorsElement = document.querySelector(
			`#${currentContactToEdit} .field-errors`
		);
		editContactErrorsElement.innerHTML = "";

		editContactErrors.forEach((error) => {
			editContactErrorsElement.innerHTML += `<li>${error}</li>`;
		});

		return;
	}

	// Retrieve Contact ID
	let foundContactEntry = event.target.parentElement.parentElement;

	if (event.target.nodeName === "H3") {
		foundContactEntry = foundContactEntry.parentElement;
	}

	const foundId = foundContactEntry.id.split("-")[1];

	// * Make EditContact API call
	let jsonPayload = JSON.stringify({
		id: foundId,
		name: `${firstNameValue} ${lastNameValue}`,
		phone: convertPhoneNumberFormat(phoneNumberValue),
		email: emailValue,
	});

	let url = urlBase + "/UpdateContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				resetAllFields();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

const deleteContact = (event) => {
	let foundContactEntry =
		event.target.parentElement.parentElement.parentElement;

	if (event.target.nodeName === "H3") {
		foundContactEntry = foundContactEntry.parentElement;
	}

	const foundId = foundContactEntry.id.split("-")[1];

	// * Make deleteContacts API call
	let jsonPayload = JSON.stringify({
		id: foundId,
	});

	let url = urlBase + "/DeleteContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				resetAllFields();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(`Error: ${err.message}`);
	}
};

// * ================ UTILS ================
const convertPhoneNumberFormat = (phoneNumber) => {
	const phoneNumberPure = [];

	for (let i = 0; i < phoneNumber.length; i++) {
		if (!isNaN(phoneNumber.charAt(i))) {
			phoneNumberPure.push(phoneNumber.charAt(i));
		}
	}

	phoneNumberPure.splice(0, 0, "(");
	phoneNumberPure.splice(4, 0, ")");
	phoneNumberPure.splice(8, 0, "-");

	return phoneNumberPure.join("");
};
