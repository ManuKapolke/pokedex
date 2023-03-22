const LOAD_LIMIT = 20;
const loadedPokemon = [];
// let numberOfLoadedPokemon = 0;
// let currentPokemon;


async function init() {
    await loadPokemon();
    renderPokemon();
}

async function loadPokemon(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    const urlForShortList = getPokemonURL(offset, limit);
    let responseShortList = await fetch(urlForShortList);
    let shortListAsJson = await responseShortList.json();

    for (let i = 0; i < shortListAsJson['results'].length; i++) {
        const url = shortListAsJson['results'][i]['url'];
        let responsePokemon = await fetch(url);
        let pokemonAsJson = await responsePokemon.json();
        loadedPokemon.push(pokemonAsJson);
    }

    console.log('Loaded Pokemon:', loadedPokemon);
}


function renderPokemon() {
    for (let i = 0; i < loadedPokemon.length; i++) {
        renderPokebox(i);
    }
}

function renderPokebox(index) {
    const container = document.getElementById('all-pokemon-container');
    container.innerHTML += getPokeboxHtmlFrame(index);

    document.getElementById('pokebox-name-' + index).innerHTML = capitalizeFirstLetter(loadedPokemon[index]['name']);

    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        const type = capitalizeFirstLetter(loadedPokemon[index]['types'][i]['type']['name']);
        document.getElementById('pokebox-types-' + index).innerHTML += `<div>${type}</div>`;
    }

    document.getElementById('pokebox-id-' + index).innerHTML = '#' + loadedPokemon[index]['id'].toString().padStart(4, '0');

    document.getElementById('pokebox-img-' + index).src = loadedPokemon[index]['sprites']['other']['official-artwork']['front_default'];
}


function getPokeboxHtmlFrame(index) {
    return `
        <div id="pokebox-${index}" class="pokebox" onclick="openSingleCard(${index})">
            <div>
                <h3 id="pokebox-name-${index}"></h3>
                <div id="pokebox-types-${index}" class="pokemon-types"></div>
            </div>
            <span id="pokebox-id-${index}"></span>
            <img id="pokebox-img-${index}" class="pokebox-img">
            <div class="pokebox-ball-bg"><img src="img/pokeball_bg.png"></div>
        </div>
    `;
}





function renderPokemonInfo() {
    document.getElementById('pokemon-name').innerHTML = loadedPokemon[0]['name'];
}


function renderPokemonImage() {
    document.getElementById('pokemon-img').src = loadedPokemon[0]['sprites']['other']['official-artwork']['front_default'];
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



function getPokemonURL(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    return `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
}


window.onscroll = function () {

    const current = document.documentElement.scrollTop + window.innerHeight;
    const maxHeight = document.body.scrollHeight;

    // if current position is more than 80% of document height
    if (current > maxHeight * 0.8) {
        console.log('Mehr Pokemon laden');
    } else {
        console.log('Nichts unternehmen');
    }
};





function openSingleCard() {
    removeElement('all-pokemon-container');
    showElement('single-pokemon-container');
    renderPokecard();

    // renderSingleCard(imgIndex);
}


function renderPokecard() {
    let pokemonName = capitalizeFirstLetter(loadedPokemon[0]['name']);
    document.getElementById('pokemon-name').innerHTML = pokemonName;
    // renderPokemonInfo();

    document.getElementById('pokemon-img').src = loadedPokemon[0]['sprites']['other']['official-artwork']['front_default'];
    // renderPokemonImage();


    // About
    document.getElementById('species').innerHTML = loadedPokemon[0]['species']['name'];
    document.getElementById('height').innerHTML = loadedPokemon[0]['height'] + ' ft';
    document.getElementById('weight').innerHTML = loadedPokemon[0]['weight'] + ' lbs';

    const abilities = [];
    for (let i = 0; i < loadedPokemon[0]['abilities'].length; i++) {
        const ability = loadedPokemon[0]['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    document.getElementById('abilities').innerHTML = abilities.join(', ');

    // Base Stats
    const MAX_STAT_VALUE = 160;
    document.getElementById('stats-table').innerHTML = '';
    for (let i = 0; i < loadedPokemon[0]['stats'].length; i++) {
        const statName = loadedPokemon[0]['stats'][i]['stat']['name'];
        const statValue = loadedPokemon[0]['stats'][i]['base_stat'];
        const statPercent = Math.round(statValue * (100 / MAX_STAT_VALUE));
        document.getElementById('stats-table').innerHTML += `
            <tr>
                <th>${statName}</th>
                <td>${statValue}</td>
                <td>
                    <div class="progress" role="progressbar">
                        <div class="progress-bar progress-bar-striped bg-danger" style="width:${statPercent}%">
                        </div>
                    </div>
                </td>
            </tr>
        `;

        if (statValue > MAX_STAT_VALUE)
            console.warn('statValue = ', statValue, ' > MAX_STAT_VALUE');
    }

    // Moves
    document.getElementById('moves-container').innerHTML = '';
    for (let i = 0; i < loadedPokemon[0]['moves'].length; i++) {
        const move = loadedPokemon[0]['moves'][i]['move']['name'];
        document.getElementById('moves-container').innerHTML += `<div>${move}</div>`;
    }
}




function closeSingleCard() {
    removeElement('single-pokemon-container');
    showElement('all-pokemon-container');
}


function doNotClose(event) {
    event.stopPropagation();
}


function showElement(id) {
    if (document.getElementById(id).classList.contains('d-none'))
        document.getElementById(id).classList.remove('d-none');
    if (document.getElementById(id).classList.contains('hidden'))
        document.getElementById(id).classList.remove('hidden');
}


function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}


function removeElement(id) {
    document.getElementById(id).classList.add('d-none');
}