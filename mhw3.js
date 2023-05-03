var text;
function search(event) {

    event.preventDefault();

    const content = document.querySelector("#content").value;

    if (content) {


        text = encodeURIComponent(content);
        console.log('Eseguo ricerca elementi riguardanti: ' + text);

        const tipo = document.querySelector("#tipo").value;
        console.log('Ricerco elementi di tipo: ' + tipo);



        if (tipo === "muscolo") {

            const exe_request = exe_api_endpoint + "?primaryMuscle=" + text;

            fetch(exe_request,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '989e604750msh3b15d6b8d42f6f3p1a7868jsnb4766a6227a5',
                        'X-RapidAPI-Host': 'exerciseapi3.p.rapidapi.com'
                    }
                }).then(onResponse).then(onJSON);

                getFromImgur();


        } else if (tipo === "esecuzione") {

            const exe_request = exe_api_endpoint + "?name=" + text;

            fetch(exe_request,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '989e604750msh3b15d6b8d42f6f3p1a7868jsnb4766a6227a5',
                        'X-RapidAPI-Host': 'exerciseapi3.p.rapidapi.com'
                    }
                }).then(onResponse).then(onJSON);
        }

    }
}

function onResponse(response) {
    return response.json();
}

function onJSON(json) {
    console.log(json);

    const results = json;
    
    for (result of results) {
        let name = result.Name;
        console.log(name);
        const exe_t = document.createElement("span");
        let yt_link = result["Youtube link"];
        console.log(yt_link);
    }
}

let results;
function onJSONimg(json) {
    console.log(json);

    const albumView = document.querySelector("#album-view");
    albumView.innerHTML = '';

     results = json.data;
     for(result of results){
        if(result.title === text){
            const imageUrl = result.link;
            const container = document.createElement("div");
            const img = document.createElement("img");
            img.src = imageUrl;

            container.appendChild(img);
            albumView.appendChild(container);
        }
     }
}

function onTokenResponse(response) {
    return response.json();
}


function getFromImgur(){
    fetch('https://api.imgur.com/3/account/pbrosio779/images',
                {
                    headers: 
                    {
                        'Authorization': 'Bearer ' + token
                    }
                }
            ).then(onResponse).then(onJSONimg);
}

let token;
function getToken(json) {
    console.log(json);
    token = json.access_token;
    console.log(token);
}


//keys and endpoint
const exe_api_endpoint = "https://exerciseapi3.p.rapidapi.com/search/";

const form1 = new FormData();
form1.append('refresh_token', '5314bc81bf0a2292beb3562088a56f6564c46b1f');
form1.append('client_id', '52f591ff8be68a8');
form1.append('client_secret', '70ee6194153b3de18fc1e4ce4e05ffd5e0f739d7');
form1.append('grant_type', 'refresh_token');

fetch('https://api.imgur.com/oauth2/token', {
    method: 'POST',
    body: form1
}).then(onTokenResponse).then(getToken);

const form = document.querySelector("#search_content");
form.addEventListener("submit", search);