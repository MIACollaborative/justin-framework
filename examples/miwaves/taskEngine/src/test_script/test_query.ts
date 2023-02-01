// [Note] nvm use 18.10.0

fetch('http://localhost:8000/users/participant1/responses?limit=1&orderBy=createdAt&order=asc',
    {
        headers: { Authorization: 'Bearer abcdefghi' }
    })
    .then(async (response) => {
        console.log(`get response`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
        else{
            console.log(`error: ${response.json()}`);
        }
    })

/*
fetch('http://127.0.0.1:8000/users/participant1/responses?limit=1&orderBy=createdAt&order=asc')
  .then((response) => response.json())
  .then((data) => console.log(data));
*/



// SWAPI API works
/*
fetch("https://swapi.dev/api/people/1/")
.then(async (response) => {
    console.log(`get response`);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
    }
    else{
        console.log(`error: ${JSON.stringify(response)}`);
    }
})
*/
