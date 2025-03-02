const pageLoad = () => {
    let user = User.getInstance();
    if (user.isLoggedIn())
        window.location.href = "contacts.html";
}

const toggleSignType = () => {
    const formBlock = document.querySelector('.auth-block');
    if (formBlock == undefined) {
        throw Error("Something went wrong");
    }

    formBlock.classList.toggle('sign-in-type');
}

const signIn = () => {
    const username = document.querySelector("#sign-in-username").value.toLowerCase();
    // TODO: hash the password
    const password = document.querySelector("#sign-in-password").value;
    const incorrectUNPWlbl = document.querySelector('#un-pw-incorr-lbl');
   
    const hashedPassword = md5(password);

    try {
        console.log("Signing in...");

        // Call the API to log in
        API.login(username, hashedPassword).then((res) => {
            if (res.error === '') {
                console.log("Login successful.");    
                // store user.
                sessionStorage.setItem('user', JSON.stringify(res));

                //redirect to landing page
                window.location.href = "contacts.html";
            // show error label.
            } else {
                incorrectUNPWlbl.style.display = 'inline';
            }
        })

    } catch (error) {
        console.error("Error during login:", error);
    }
}

const signUp = () => {
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const username = document.querySelector("#sign-up-username").value;
    const password = document.querySelector("#sign-up-password").value;

    document.querySelector('#errorTaken').classList.remove('active')

    if (!firstname) {
        document.querySelector("#errorFirstName").classList.add('active');
    } else {
        document.querySelector("#errorFirstName").classList.remove('active');
    }

    if (!lastname) {
        document.querySelector("#errorLastName").classList.add('active');
    } else {
        document.querySelector("#errorLastName").classList.remove('active');
    }

    if (!username) {
        document.querySelector("#errorUserName").classList.add('active');
    } else {
        document.querySelector("#errorUserName").classList.remove('active');
    }

    if (!password) {
        document.querySelector("#errorPassword").classList.add('active');
    } else {
        document.querySelector("#errorPassword").classList.remove('active');
    }

    // check if anything is blank!
    if (firstname === '' || lastname === '' || username === '' || password === '')
        return;
    
    // hash password 
    const hashedPassword = md5(password);

    try {
        API.registerUser(firstname,lastname,username.toLowerCase(),hashedPassword).then((res) => {
            if (res.error === '') {
                // set
                document.querySelector('#sign-in-username').value = username;
                toggleSignType();
            } else if (res.error.endsWith("is already taken.")) {
                const errorBlock = document.querySelector('#errorTaken')
                errorBlock.innerHTML = "This username already exists";
                errorBlock.classList.add('active');
            } else {
                const errorBlock = document.querySelector('#errorTaken')
                errorBlock.innerHTML = "Something went wrong, please try again later";
                errorBlock.classList.add('active');
            }
        })
    } catch (error) {
        console.log("Uknown error when attempting to call sign up API");
    }
}