const LOAD_LIMIT = 20;
const LBS_IN_KG = 0.453592;
const FT_IN_CM = 30.48;
const MAX_STAT_VALUE = 160;
let loadedPokemon = [];
let numberOfRenderedPokemon = 0;
let totalNumberOfPokemon;
let searchIsActive = false;


async function loadAndRenderPokemon() {
    showElement('loader');
    await loadPokemon();
    renderPokemon();
    removeElement('loader');
    numberOfRenderedPokemon += LOAD_LIMIT;
}


/*--------------------------------------------------
Load Pokemon
---------------------------------------------------*/
async function loadPokemon(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    let pokelist = await getShortlistOfNamesAndURLs(offset, limit);
    totalNumberOfPokemon = pokelist['count'];

    for (let i = 0; i < pokelist['results'].length; i++) {
        const url = pokelist['results'][i]['url'];
        let pokemon = await fetchAsJson(url);
        loadedPokemon.push(pokemon);
    }
}


async function getShortlistOfNamesAndURLs(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    const url = getPokemonShortlistURL(offset, limit);
    return await fetchAsJson(url);
}


async function fetchAsJson(url) {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    return responseAsJson;
}


function getPokemonShortlistURL(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    return `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
}


function getPokemonDetailsURL(name) {
    return `https://pokeapi.co/api/v2/pokemon/${name}`;
}


/*--------------------------------------------------
Render Pokemon ("Pokeboxes")
---------------------------------------------------*/
function renderPokemon() {
    let startIndex = numberOfRenderedPokemon;
    for (let i = startIndex; i < loadedPokemon.length; i++) {
        renderPokebox(i);
    }
    for (let i = startIndex; i < loadedPokemon.length; i++) {
        setBoxColors(i);
    }
}


function renderPokebox(index) {
    renderPokeboxFrame(index);
    renderPokemonName(index);
    renderPokemonTypes(index);
    renderPokemonId(index);
    renderPokemonImage(index);
}


function renderPokeboxFrame(index) {
    document.getElementById('all-pokemon-container').innerHTML += `
        <div id="pokebox-${index}" class="pokebox" onclick="openPokecard(${index})">
            <div>
                <h3 id="pokebox-name-${index}"></h3>
                <div id="pokebox-types-${index}" class="poketypes"></div>
            </div>
            <span id="pokebox-id-${index}"></span>
            <img id="pokebox-img-${index}" class="pokebox-img">
            <div class="pokebox-ball-bg"><img src="img/pokeball_bg.png"></div>
        </div>
    `;
}


function renderPokemonName(index, elemId = `pokebox-name-${index}`) {
    const name = capitalizeFirstLetter(getLoadedPokemonName(index));
    document.getElementById(elemId).innerHTML = name;
}


function renderPokemonTypes(index, elemId = `pokebox-types-${index}`) {
    clearElement(elemId);
    const types = getLoadedPokemonTypes(index);
    for (let i = 0; i < types.length; i++) {
        const type = capitalizeFirstLetter(types[i]);
        document.getElementById(elemId).innerHTML += `<div class="${elemId}">${type}</div>`;
    }
}


function renderPokemonId(index, elemId = `pokebox-id-${index}`) {
    const id = `#${getLoadedPokemonId(index).toString().padStart(4, '0')}`;
    document.getElementById(elemId).innerHTML = id;
}


function renderPokemonImage(index, elemId = `pokebox-img-${index}`) {
    const image = getLoadedPokemonImage(index);
    document.getElementById(elemId).src = image || '';
}


function setBoxColors(index) {
    setBackgroundDependentOnFirstType(index);
    setLightBackgroundDependentOnFirstType(index);
}


function setBackgroundDependentOnFirstType(index) {
    const firstType = getLoadedPokemonTypes(index)[0];
    document.getElementById(`pokebox-${index}`).classList.add(`bg-${firstType}`);
}


function setLightBackgroundDependentOnFirstType(index) {
    const types = getLoadedPokemonTypes(index);
    const firstType = types[0];
    for (let i = 0; i < types.length; i++) {
        document.getElementsByClassName(`pokebox-types-${index}`)[i].classList.add(`light-bg-${firstType}`);
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getLoadedPokemonName(index) {
    return loadedPokemon[index]['name'];
}


function getLoadedPokemonId(index) {
    return loadedPokemon[index]['id'];
}


function getLoadedPokemonImage(index) {
    return loadedPokemon[index]['sprites']['other']['official-artwork']['front_default'];
}


function getLoadedPokemonTypes(index) {
    let types = [];
    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        const type = loadedPokemon[index]['types'][i]['type']['name'];
        types.push(type);
    }
    return types;
}


function getLoadedPokemonSpecies(index) {
    return loadedPokemon[index]['species']['name'];
}


function getLoadedPokemonHeight(index) {
    let height = loadedPokemon[index]['height'];
    let heightInCM = turnHeightIntoCM(height);
    return heightInCM;
}


function getLoadedPokemonWeight(index) {
    let weight = loadedPokemon[index]['weight'];
    let weightInKG = turnWeightIntoKG(weight);
    return weightInKG;
}


function getLoadedPokemonAbilities(index) {
    let abilities = [];
    for (let i = 0; i < loadedPokemon[index]['abilities'].length; i++) {
        const ability = loadedPokemon[index]['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    return abilities;
}


function getLoadedPokemonStats(index) {
    let stats = [];
    for (let i = 0; i < loadedPokemon[index]['stats'].length; i++) {
        const statName = loadedPokemon[index]['stats'][i]['stat']['name'];
        const statValue = loadedPokemon[index]['stats'][i]['base_stat'];
        const statPercent = Math.round(statValue * (100 / MAX_STAT_VALUE));
        const stat = { name: statName, value: statValue, percent: statPercent };
        stats.push(stat);
    }
    return stats;
}


function getLoadedPokemonMoves(index) {
    let moves = [];
    for (let i = 0; i < loadedPokemon[index]['moves'].length; i++) {
        const move = loadedPokemon[index]['moves'][i]['move']['name'];
        moves.push(move);
    }
    return moves;
}


function turnHeightIntoCM(height) {
    return height * 10;
}


function turnWeightIntoKG(height) {
    return (height / 10).toFixed(1);
}


/*--------------------------------------------------
Show / Hide
---------------------------------------------------*/
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


function clearElement(id) {
    document.getElementById(id).innerHTML = '';
}


/*--------------------------------------------------
Load/Render On Scroll
---------------------------------------------------*/
window.onscroll = async function () {
    const current = document.documentElement.scrollTop + window.innerHeight;
    const maxHeight = document.body.scrollHeight;

    if (current == maxHeight && loadedPokemon.length < totalNumberOfPokemon) {
        if (searchIsActive)
            loadAndRenderFurtherSearchedPokemon(searchString);
        else
            loadAndRenderPokemon();
    }
};