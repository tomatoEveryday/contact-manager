class API {
    // todo: make sure this is production URL by the time we deploy.
    static BASE_API_URL = 'http://answerstopoosfinal.online/dev/LAMPAPI/';

    /**
     * Function to make a basic post API call to a given endpoint.
     * @param {String} url API Url to post to
     * @param {Dict} body JSON Body 
     * @returns 
     */
    static async baseAPIPostCall(url, body) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("POST", url);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(body));
            // get that response
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
        });
    }

    /**
     * Logs user in and returns user JSON object from API.
     * @param {String} username user's username
     * @param {String} password user's password
     * @returns JSON user object
     */
    static async login(username, password) {
       const body = {
        'login'   : username,
        'password': password
       }
       const url = API.BASE_API_URL + "Login.php";
       return this.baseAPIPostCall(url, body);
    }

    /**
     * Registers user
     * @param {*} firstName 
     * @param {*} lastName 
     * @param {*} userName 
     * @param {*} password 
     * @returns 
     */
    static async registerUser(firstName, lastName, userName, password) {
        const body = {
            'FirstName' : firstName,
            'LastName'  : lastName,
            'Login'     : userName,
            'Password'  : password
        };
        const url = API.BASE_API_URL + "AddUser.php";
        return this.baseAPIPostCall(url, body);
    }


    /**
     * Adds a new contact.
     * @param {String} firstName first name
     * @param {String} lastName  last name
     * @param {String} phone  phone number
     * @param {String} email  email address
     * @returns 
     */
    static async addContact(userID, firstName, lastName, phone, email) {
        const body = {
            'UserID'    : userID,
            'FirstName' : firstName,
            'LastName'  : lastName,
            'Phone'     : phone,
            'Email'     : email,
        };
        const url = API.BASE_API_URL + "AddContact.php";
        return this.baseAPIPostCall(url, body);
    }

    /**
     * Searches a given user's contacts for a match.
     * @param {Integer} userID User's ID
     * @param {String} search User's search string.
     * @returns Results from contact search.
     */
    static async searchContacts(userID, search, page) {
        // build request
        const body = {
            'UserID': userID,
            'Search': search,
            'Page'  : page
        };
        // send that
        const url = API.BASE_API_URL + "SearchContacts.php";
        return this.baseAPIPostCall(url,body);
    }

    /**
     * Gets a contact page from the user.
     * @param {Integer} userID 
     * @param {Integer} page 
     * @returns Specified contact page for user.
     */
    static async getContactPage(userID, page) {
        const body = {
            "UserID" : userID,
            "Page"   : page
        };
        const url = API.BASE_API_URL + "Paging.php";
        return this.baseAPIPostCall(url,body);
    }

    /**
     * Deletes contact ID
     * @param {Integer} contactID 
     * @returns response from delete
     */
    static async deleteContact(contactID) {
        const body = {
            'ID':contactID
        };
        const url = API.BASE_API_URL + "DeleteContact.php";
        return this.baseAPIPostCall(url,body);
    }

    static async updateContact(contactID, userID, firstName, lastName, phone, email) {
        console.log("heyyy");
        const body = {
            "ID": contactID,
            "UserID": userID,
            "FirstName": firstName,
            "LastName": lastName,
            "Phone": phone,
            "Email": email,
        }
        // console.log(body)
        const url = API.BASE_API_URL + "UpdateContact.php";
        return this.baseAPIPostCall(url, body);
    }

}