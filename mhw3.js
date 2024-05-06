function onButtonAddClick(event){
    const modal_view = document.querySelector("#modal-view");
    document.body.classList.add("no-scroll");
    modal_view.style.top = window.pageYOffset + 'px';
    modal_view.classList.remove("hidden");
    document.querySelector("#food").focus();
}

const button_box_list = document.querySelectorAll(".button_box");
for(let button_box of button_box_list){
    button_box.addEventListener("click", onButtonAddClick);
}

function onModalClick(){
    document.body.classList.remove("no-scroll");
    modal_view.classList.add("hidden");
    const foods_container = document.querySelector(".foods_container");
    foods_container.innerHTML = '';
    document.querySelector("#food").value = '';
}

const modal_view = document.querySelector("#modal-view");
modal_view.addEventListener("click", onModalClick);

function onClickInsertionBox(event){
    event.stopPropagation();
}
    
const food_insertion_box = document.querySelector(".food_insertion_box");
food_insertion_box.addEventListener("click", onClickInsertionBox);

function onClickFoodItem(event) {
    const food_item = event.currentTarget;
    console.log(food_item);
    const food_values = food_item.querySelectorAll(".food_values span");
    let energy = 0;
    for(let value of food_values){
        if(value.dataset.part == 2){
            energy = value.textContent;
            console.log("dicoanecalorie: " + energy);
        }
    }

    let int_energy = parseInt(energy);
    const food_calories = document.querySelector(".food_calories .upper_text");
    let int_food_calories = parseInt(food_calories.textContent);
    let tot_food_calories = int_food_calories + int_energy;
    console.log("calorie alimenti: " + tot_food_calories);
    food_calories.textContent = tot_food_calories;
    document.querySelector(".counter_tag .green_tag").textContent = tot_food_calories;

    const calories = document.querySelector(".aim .upper_text");
    let int_calories = parseInt(calories.textContent);
    let calories_left = int_calories-tot_food_calories;
    console.log("calorie rimanenti: " + calories_left);
    const calories_left_value = document.querySelector(".lower_right .calories_value");
    calories_left_value.textContent = calories_left;

     const inner_progress_bar = document.querySelector(".inner_progress_bar");
     const progress_bar = document.querySelector(".progress_bar");
     let progress_bar_width = progress_bar.offsetWidth;
     let width = Math.floor((tot_food_calories/int_calories)*progress_bar_width);
     inner_progress_bar.style.width = width + "px";
     const counter_tag = document.querySelector(".counter_tag");
     counter_tag.style.left = (width-20) + "px"

    const foods_container = document.querySelector(".foods_container");
    foods_container.innerHTML = '';
    foods_container.classList.remove("foods_container_style");
    document.querySelector(".food_insertion_box h4").remove();
    document.querySelector("#food").value = '';
}

let food_input; //variabile globale

function search(event){
    event.preventDefault();
    food_input = document.querySelector("#food").value; 
    console.log(food_input);
    const food_input_encoded = encodeURIComponent(food_input);
    console.log("Eseguo ricerca: " + food_input_encoded);

    const food_request = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + API_key + "&query=" + food_input_encoded;

    fetch(food_request).then(onResponse).then(onJson);
}

const form = document.querySelector(".food_form");
form.addEventListener("submit", search);

const API_key = "QSAssQInQmVaHbaIosXr0S86r5zJuFJfDjXCrerR";

let food_displayed = 0; //variabile globali

function onJson(json){
    console.log("Ecco il documento");
    const foods_list = json.foods;
    console.log(json);
    console.log(foods_list);

    const foods_container = document.querySelector(".foods_container");
    let energy = 0;

    if(!foods_container.querySelector(".food_item") || food_input != food_displayed){

        foods_container.innerHTML = '';

        food_displayed = json.foodSearchCriteria.generalSearchInput;
        
    if(!foods_container.classList.contains("foods_container_style")){
        foods_container.classList.add("foods_container_style");
        const secondary_title = document.createElement("h4");
        secondary_title.classList.add("food_insertion_title");
        secondary_title.textContent = "Alimenti corrispondenti:"
        const food_insertion_box = document.querySelector(".food_insertion_box");
        food_insertion_box.insertBefore(secondary_title, foods_container);
    }

        for(let i = 0; i<10; i++){

            let food_nutrients_list = json.foods[i].foodNutrients;
    
            for(let food_nutrients of food_nutrients_list){
                if(food_nutrients.nutrientName == "Energy"){
                    console.log("Energia: " + food_nutrients.value + " kcal");
                    energy = food_nutrients.value;
                    console.log(energy);
                }
                if(food_nutrients.nutrientName == "Carbohydrate, by difference"){
                    console.log("Carboidrati: " + food_nutrients.value + " g");
                }
                if(food_nutrients.nutrientName == "Total lipid (fat)"){
                    console.log("Grassi: " + food_nutrients.value + " g");
                }
                if(food_nutrients.nutrientName == "Protein"){
                    console.log("Proteine: " + food_nutrients.value + " g");
                }
            }
    
            console.log(json.foods[i].description);
            console.log(json.foods[i].brandName);
            console.log("------------------------------------");
            const food_item = document.createElement("div");
            food_item.classList.add("food_item_box");
            const food_name = document.createElement("div");
            food_name.classList.add("food_name");
            const food_values = document.createElement("p");
            const food_brand = document.createElement("span");
            food_brand.setAttribute("data-part", 1);
            food_brand.textContent = json.foods[i].brandName + " 100g, ";
            const food_energy = document.createElement("span");
            food_energy.setAttribute("data-part", 2);
            food_energy.textContent = energy;
            const text_kcal = document.createElement("span");
            text_kcal.setAttribute("data-part", 3);
            text_kcal.textContent = " kcal";
            food_values.classList.add("food_values");
            food_name.textContent = json.foods[i].description;
            foods_container.appendChild(food_item);
            food_item.appendChild(food_name);
            food_item.addEventListener("click", onClickFoodItem)
            food_item.appendChild(food_values);
            food_values.appendChild(food_brand);
            food_values.appendChild(food_energy);
            food_values.appendChild(text_kcal);
        }
    }
}

function onResponse(response){
    console.log("Risposta arrivata")
    return response.json();
}

function onJSONimg(json){
    console.log(json.data);

    const ads_images = json.data;
    const side_big_ads = document.querySelector(".side_big_ads");
    const side_small_ads = document.querySelector(".side_small_ads");
    const lower_ads = document.querySelector(".lower_ads");
    const upper_ads = document.querySelector(".upper_ads");
    const upper_ads_mobile = document.querySelector(".upper_ads_mobile");
  

    for (let image of ads_images){
        if(image.description == "orizontal_xl"){
            upper_ads.style.backgroundImage = "url(" + image.link + ")";
        }
        if(image.description == "orizontal_s"){
            upper_ads_mobile.style.backgroundImage = "url(" + image.link + ")";
            lower_ads.style.backgroundImage = "url(" + image.link + ")";
        }
        if(image.description == "vertical_xl"){
            side_big_ads.style.backgroundImage = "url(" + image.link + ")";
        }
        if(image.description == "vertical_s"){
            side_small_ads.style.backgroundImage = "url(" + image.link + ")";
        }    
    }
}

function onImgurResponse(response){
    console.log("Risposta imgur arrivata");
    return response.json();
}

function getFromImgur() {
    fetch('https://api.imgur.com/3/account/pbrosio779/images',
    {   
        headers:
        {
            'Authorization': 'Bearer ' + token  
        }
    }
).then(onImgurResponse).then(onJSONimg); 
}

let token;
function getToken(json) {
    console.log("Refresh token arrivato");
    token = json.access_token;
    getFromImgur();
}

function onTokenResponse(response) {
    console.log("Risposta token arrivata");
    return response.json();
}

const client_id = "0c79f0ae5d27e09";
const client_secret = "3c3de15c9a1ef8bb65fa520e2058e720620fce2e";
const access_token = "cb84a7eba157ae4c836662b6a63012aeb8b780c3";
const refresh_token = "3e30f23d412fe4a1c45d7486f010838e5e883ad1";

const form1 = new FormData();
form1.append('refresh_token', refresh_token);
form1.append('client_id', client_id);
form1.append('client_secret', client_secret);
form1.append('grant_type', 'refresh_token');

fetch('https://api.imgur.com/oauth2/token', {
    method: 'POST',
    body: form1
}).then(onTokenResponse).then(getToken);

