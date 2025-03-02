document.addEventListener("DOMContentLoaded", function() {
    const contactList = document.getElementById("contact-list");
    const searchBar = document.getElementById("search-bar");
    const addContactButton = document.getElementById("add-contact-button");
    const closePopupButton = document.getElementById("close-popup-button");
    const contactForm = document.getElementById("contact-form");
    const wrapper = document.querySelector('.wrapper');
    const selectedCount= document.querySelector('.selected-count')
    const searchSection = document.querySelector('.search-section');
    const searchHeader = document.querySelector('.search-header');
    const contactHeaderFlex = document.querySelector('.contact-header-flex');
    const usernameSpan = document.getElementById('username');
    const themeToggle = document.getElementById('themeToggle');
    const logoutLink = document.getElementById('logoutLink');
    const nameHeader = document.getElementById('nameHeader');
    const themeImage = document.getElementById('themeImage');
    let currentContactId = null;
    let selectedContacts = new Set();
    let longPressTimer;
    let longPressDetected = false; // Flag to indicate long press
    
    console.log("DOMContentLoaded event fired");
    
    // Set the welcome message with the username
    const username = localStorage.getItem('username');
    if (username) {
        usernameSpan.textContent = username;
    }
    
    // Check the saved theme in local storage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = 'Theme ☀️';
    } else {
        themeToggle.textContent = 'Theme 🌙';
    }
    
    // Light/dark theme
    themeToggle.addEventListener('click', () => {
        console.log("Theme select");
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeImage.src = 'images/app-logo-black.png';
            themeToggle.textContent = 'Theme ☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeImage.src = 'images/app-logo-white.png';
            themeToggle.textContent = 'Theme 🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Log out functionality
    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });
    
    // Load contacts from the API
    function loadContacts() {
        fetch('LAMPAPI/load.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: localStorage.getItem('user_id') })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.contacts) {
                renderContacts(data.contacts);
            } else {
                console.error('Error: No contacts returned');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Render contacts to the DOM with optional highlighting
    function renderContacts(contacts, query = '') {
        console.log("renderContacts function called");
        const queries = query.split(' ');
        contactList.innerHTML = '';
        let currentLetter = '';
		
		if (contacts.length === 0) {
			nameHeader.textContent = "Name";
		}
		else {
			nameHeader.textContent = "";
		}
		
        contacts.forEach(contact => {
            let sortingKeyFirstLetter = contact.sorting_key.charAt(0).toUpperCase();
            
            // Create a new sticky header if the first letter changes
            if (sortingKeyFirstLetter !== currentLetter) {
                currentLetter = sortingKeyFirstLetter;
                const headerElement = document.createElement('div');
                headerElement.className = 'sticky-header';
                headerElement.textContent = currentLetter;
                contactList.appendChild(headerElement);
            }
            
            let displayName = `${contact.first_name} ${contact.last_name}`;
            let organizationName = `${contact.organization}`;
            
            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            contactElement.dataset.contactId = contact.id;
            
            const contactNameElement = document.createElement('div');
            contactNameElement.className = 'contact-name';
            contactNameElement.innerHTML = highlightText(displayName, queries);
            
            const contactOrgElement = document.createElement('div');
            contactOrgElement.className = 'organization-name';
            contactOrgElement.innerHTML = highlightText(organizationName, queries);

            const contactEmailElement = document.createElement('div');
            contactEmailElement.className = 'contact-email';
            contactEmailElement.innerHTML = highlightText(contact.email_address || '', queries);
			
            const contactPhoneElement = document.createElement('div');
            contactPhoneElement.className = 'contact-phone';
            contactPhoneElement.innerHTML = highlightText(contact.phone_number || '', queries);

            contactElement.appendChild(contactNameElement);
            contactElement.appendChild(contactOrgElement);
            contactElement.appendChild(contactEmailElement);
            contactElement.appendChild(contactPhoneElement);
            contactList.appendChild(contactElement);
            console.log("Added contact element: ", displayName);
            
            // Add long press event for selection mode
            contactElement.addEventListener('mousedown', (event) => {
                console.log("Mouse down.");
                if (event.button === 0) {
                    longPressTimer = setTimeout(() => {
                        longPressDetected = true;
                        toggleSelection(contactElement);
                    }, 1000);
                }
            });

            contactElement.addEventListener('mouseup', () => {
                console.log("Mouse up.");
                clearTimeout(longPressTimer);
            });

            // Add click event to toggle selection if in selection mode
            contactElement.addEventListener('click', (event) => {
                if (longPressDetected) {
                    console.log("INITAL TRIGGER: ", selectedContacts.size);
                    event.preventDefault(); // Prevent the click if it was a long press
                    longPressDetected = false; // Reset the flag
                } else if (selectedContacts.size > 0) {
                    console.log("SELECT RETRIGGER: ", selectedContacts.size);
                    toggleSelection(contactElement);
                } else {
                    showUpdateForm(contact);
                }
            });

            contactList.appendChild(contactElement);
        });
    }

    function toggleSelection(contactElement) {
        console.log("Selection enabled.");
        const contactId = contactElement.dataset.contactId;
        if (selectedContacts.has(contactId)) {
            selectedContacts.delete(contactId);
            contactElement.classList.remove('selected');
            console.log("REMOVED");
        } else {
            selectedContacts.add(contactId);
            contactElement.classList.add('selected');
            console.log("SELECTED");
        }
    
        updateSelectionUI();
    }

    function updateSelectionUI() {
        const deleteButton = document.getElementById('delete-contact-button');
        if (selectedContacts.size > 0) {
            deleteButton.style.display = 'block';
            addContactButton.style.display = 'none';
			selectedCount.textContent = `(${selectedContacts.size} selected)`;
        } else {
            deleteButton.style.display = 'none';
            addContactButton.style.display = 'block';
            selectedCount.textContent = ``;
        }
    }

    document.getElementById('delete-contact-button').addEventListener('click', () => {
        if (selectedContacts.size > 0) {
            if (confirm(`Are you sure you want to delete ${selectedContacts.size} contact(s)?`)) {
                selectedContacts.forEach(contactId => {
                    fetch('LAMPAPI/delete.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: contactId })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error(`Error deleting contact ${contactId}: `, data.error);
                        } else {
                            console.log(`Contact ${contactId} deleted successfully`);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                });

                // Reload contacts after deletion
                loadContacts();
                selectedContacts.clear();
                updateSelectionUI();
            }
        }
    });
    
    // Highlight the matching parts of the text
    function highlightText(text, queries) {
        if (!queries) return text;
		const pattern = queries.join('|');
        const regex = new RegExp(pattern, 'gi');
		
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }
    
    // Handle search functionality
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        if (query) {
            fetch('LAMPAPI/search.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: localStorage.getItem('user_id'), search_string: query })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.contacts) {
                    renderContacts(data.contacts, query);
                } else {
                    console.error('Error: No contacts returned');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            loadContacts(); // Reload contacts if the query is empty
        }
    });

    // Handle panel functionality for the "Add Contact" section
    addContactButton.addEventListener('click', () => {
        currentContactId = null;
        wrapper.classList.toggle('side-panel-open');
        searchSection.classList.toggle('search-section-full');
        searchHeader.classList.toggle('search-header-full');
        contactHeaderFlex.classList.toggle('contact-header-flex-full');
        contactForm.reset();
        document.querySelector('.contact-form-title').textContent = 'Contact Form';
        document.querySelector('.contact-button').textContent = 'Add';
    });

    closePopupButton.addEventListener('click', () => {
        wrapper.classList.remove('side-panel-open');
        searchSection.classList.add('search-section-full');
        searchHeader.classList.add('search-header-full');
        contactHeaderFlex.classList.add('contact-header-flex-full');
    });

    // Handle form submission for both adding and updating contact
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const contactData = {
            organization: formData.get('organization'),
            last_name: formData.get('last_name'),
            first_name: formData.get('first_name'),
            phone_number: formData.get('phone_number'),
            email_address: formData.get('email_address'),
            user_id: localStorage.getItem('user_id')
        };

        const url = currentContactId ? "LAMPAPI/update.php" : "LAMPAPI/add.php";
        if (currentContactId) contactData.id = currentContactId;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData),
            });

            const data = await response.json();

            if (data.error) {
                handleErrors(data.error);
            } else {
                // Clear form and errors if submission is successful
                contactForm.reset();
                clearErrors();
                // Reload contacts
                loadContacts();
                wrapper.classList.remove('side-panel-open');
                searchSection.classList.add('search-section-full');
                searchHeader.classList.add('search-header-full');
                contactHeaderFlex.classList.add('contact-header-flex-full');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function handleErrors(errors) {
        clearErrors();
        const errorMessage = errors.join('\n');

        // Display all errors at the bottom of the form
        const bottomErrorFeedback = document.getElementById('bottomErrorFeedback');
        if (bottomErrorFeedback) {
            bottomErrorFeedback.textContent = errorMessage;
            bottomErrorFeedback.style.display = 'block';
        }

        // Mark relevant fields as invalid
        errors.forEach(error => {
            if (error.includes('Either phone number or email')) {
                markFieldAsInvalid('phone_number');
                markFieldAsInvalid('email_address');
            } else if (error.includes('first name, last name, or organization')) {
                markFieldAsInvalid('first_name');
                markFieldAsInvalid('last_name');
                markFieldAsInvalid('organization');
            } else {
                const field = getFieldFromError(error);
                markFieldAsInvalid(field);
            }
        });
    }

    function markFieldAsInvalid(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add("is-invalid");
        }
    }

    function getFieldFromError(error) {
        if (error.includes('Invalid email format')) return 'email_address';
        if (error.includes('Phone number must be at least 10 digits long')) return 'phone_number';
        if (error.includes('Phone number already exists')) return 'phone_number';
        if (error.includes('Email address already exists')) return 'email_address';
        if (error.includes('Organization must contain only letters and numbers')) return 'organization';
        if (error.includes('Last name must contain only letters and numbers')) return 'last_name';
        if (error.includes('First name must contain only letters and numbers')) return 'first_name';
        return '';
    }

    function clearErrors() {
        const fields = ['organization', 'last_name', 'first_name', 'phone_number', 'email_address'];
        fields.forEach(field => {
            const inputField = document.getElementById(field);
            if (inputField) {
                inputField.classList.remove("is-invalid");
            }
        });

        const bottomErrorFeedback = document.getElementById('bottomErrorFeedback');
        if (bottomErrorFeedback) {
            bottomErrorFeedback.textContent = '';
            bottomErrorFeedback.style.display = 'none';
        }
    }

    function showUpdateForm(contact) {
        currentContactId = contact.id;
        wrapper.classList.add('side-panel-open');
        searchSection.classList.remove('search-section-full');
        searchHeader.classList.remove('search-header-full');
        contactHeaderFlex.classList.remove('contact-header-flex-full');
        document.querySelector('.contact-form-title').textContent = 'Contact Form';
        document.querySelector('.contact-button').textContent = 'Update';

        document.getElementById('organization').value = contact.organization || '';
        document.getElementById('last_name').value = contact.last_name || '';
        document.getElementById('first_name').value = contact.first_name || '';
        document.getElementById('phone_number').value = contact.phone_number || '';
        document.getElementById('email_address').value = contact.email_address || '';
    }

    // Initial load of contacts
    loadContacts();
});
document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const introMessage = document.getElementById("introMessage");
    const loginForm = document.getElementById("loginForm");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton")
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");
    const registerLink = document.getElementById("registerLink");
    const themeToggle = document.getElementById('themeToggle');
    const themeImage = document.getElementById('themeImage');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeImage.src = 'images/app-logo-black.png';
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeImage.src = 'images/app-logo-white.png';
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });

    welcomeMessage.addEventListener("animationend", () => {
        introMessage.style.display = "block";
        introMessage.classList.add("typing-effect");
    });

    introMessage.addEventListener("animationend", () => {
        setTimeout(() => {
            loginUsername.classList.add("visible");
            loginPassword.classList.add("visible");
            registerLink.classList.add("visible");
            loginButton.classList.add("visible");
            themeToggle.classList.add("visible");
            themeImage.classList.add("visible");
            loginForm.style.display = "block";
        }, 500);
    });

    registerLink.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    toggleLoginPassword.addEventListener("click", () => {
        const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
        loginPassword.setAttribute("type", type);
        toggleLoginPassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!username) {
            loginUsername.classList.add("is-invalid");
            return;
        } else {
            loginUsername.classList.remove("is-invalid");
        }

        if (!password) {
            loginPassword.classList.add("is-invalid");
            return;
        } else {
            loginPassword.classList.remove("is-invalid");
        }

        try {
            const response = await fetch("LAMPAPI/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.error) {
                if (data.error === "Username does not exist") {
                    loginUsername.classList.add("is-invalid");
                    document.getElementById("usernameFeedback").textContent = "Username does not exist";
                } else if (data.error === "Incorrect password") {
                    loginPassword.classList.add("is-invalid");
                    document.getElementById("passwordFeedback").textContent = "Incorrect password";
                } else {
                    console.log("API returned error: ", data.error);
                }
            } else {
                loginUsername.classList.remove("is-invalid");
                loginPassword.classList.remove("is-invalid");
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("username", username);
                window.location.href = "contacts.html";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
