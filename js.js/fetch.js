fetch('https://api.example.com/data',{.......})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

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
