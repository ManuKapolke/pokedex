const LOAD_LIMIT = 20;
const LBS_IN_KG = 0.453592;
const FT_IN_CM = 30.48;
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
    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        const type = capitalizeFirstLetter(getLoadedPokemonType(index, i));
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
    const firstType = getLoadedPokemonType(index, 0);
    document.getElementById(`pokebox-${index}`).classList.add(`bg-${firstType}`);
}


function setLightBackgroundDependentOnFirstType(index) {
    const firstType = getLoadedPokemonType(index, 0);
    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        document.getElementsByClassName(`pokebox-types-${index}`)[i].classList.add(`light-bg-${firstType}`);
    }
}


function getLoadedPokemonType(index, typeIndex) {
    return loadedPokemon[index]['types'][typeIndex]['type']['name'];
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


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/*--------------------------------------------------
Open/Render Single Pokemon Details ("Pokecard")
---------------------------------------------------*/
async function openPokecard(index) {
    veilBackground();
    showElement('single-pokemon-container');
    await renderPokecard(index);
    setCardColors(index);
}


function closePokecard() {
    removeElement('single-pokemon-container');
    unveilBackground();
}


function veilBackground() {
    document.getElementById('all-pokemon-container').style.opacity = 0.3;
    document.getElementById('body').classList.add('no-scrolling');
}


function unveilBackground() {
    document.getElementById('all-pokemon-container').style.opacity = 1;
    document.getElementById('body').classList.remove('no-scrolling');
}


async function renderPokecard(index) {
    renderPokecardHeader(index);
    await setPreviousCardButton(index);
    await setNextCardButton(index);




    // About
    document.getElementById('species').innerHTML = loadedPokemon[index]['species']['name'];
    document.getElementById('height').innerHTML = `${turnHeightIntoCM(loadedPokemon[index]['height'])} cm`;
    document.getElementById('weight').innerHTML = `${turnWeightIntoKG(loadedPokemon[index]['weight'])} kg`;

    const abilities = [];
    for (let i = 0; i < loadedPokemon[index]['abilities'].length; i++) {
        const ability = loadedPokemon[index]['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    document.getElementById('abilities').innerHTML = abilities.join(', ');

    // Base Stats
    const MAX_STAT_VALUE = 160;
    document.getElementById('stats-table').innerHTML = '';
    for (let i = 0; i < loadedPokemon[index]['stats'].length; i++) {
        const statName = loadedPokemon[index]['stats'][i]['stat']['name'];
        const statValue = loadedPokemon[index]['stats'][i]['base_stat'];
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

        // if (statValue > MAX_STAT_VALUE)
        //     console.warn('statValue = ', statValue, ' > MAX_STAT_VALUE');
    }

    // Moves
    document.getElementById('moves-container').innerHTML = '';
    for (let i = 0; i < loadedPokemon[index]['moves'].length; i++) {
        const move = loadedPokemon[index]['moves'][i]['move']['name'];
        document.getElementById('moves-container').innerHTML += `<div id="move-${index}-${i}">${move}</div>`;
    }
}


function renderPokecardHeader(index) {
    renderPokemonName(index, 'pokemon-name');
    renderPokemonTypes(index, 'pokemon-types');
    renderPokemonId(index, 'pokemon-id');
    renderPokemonImage(index, 'pokemon-img');
}


async function setPreviousCardButton(index) {
    await hideOrShowPreviousCardButton(index);
    setOnclickForPreviousCardButton(index);
}


async function hideOrShowPreviousCardButton(index) {
    if (isFirstIndex(index) || await isFirstIndexOfSearchedPokemon(index))
        hideElement('previous-card');
    else
        showElement('previous-card');
}


function setOnclickForPreviousCardButton(index) {
    // if (index > 0) {        
    document.getElementById('previous-card').onclick = () => {
        onclickForPreviousCardButton(index);
    }
    // }
}


function onclickForPreviousCardButton(index) {
    openPokecard(index - 1);
}


async function setNextCardButton(index) {
    await showOrHideNextCardButton(index);
    setOnclickForNextCardButton(index);
}


async function showOrHideNextCardButton(index) {
    if (isLastIndexOfAllPokemon(index) || await isLastIndexOfSearchedPokemon(index))
        hideElement('next-card');
    else
        showElement('next-card');
}


function setOnclickForNextCardButton(index) {
    if (isLastIndexOfLoadedPokemon(index)) {
        document.getElementById('next-card').onclick = async () => {
            onclickForNextCardButtonInLastCard(index);
        }
    }
    else {
        document.getElementById('next-card').onclick = () => {
            onclickForNextCardButton(index);
        }
    }
}


async function onclickForNextCardButtonInLastCard(index) {
    if (searchIsActive)
        await loadAndRenderFurtherSearchedPokemon(searchString);
    else
        await loadAndRenderPokemon();
    openPokecard(index + 1);
}


function onclickForNextCardButton(index) {
    openPokecard(index + 1);
}


function isFirstIndex(index) {
    return index === 0;
}


async function isFirstIndexOfSearchedPokemon(index) {
    return searchIsActive && await isFirstSearchedName(index);
}


async function isFirstSearchedName(index) {
    let searchedNames = await getSearchedPokemonNames(searchString);
    return getLoadedPokemonName(index) === searchedNames.at(0);
}



function isLastIndexOfLoadedPokemon(index) {
    return index === loadedPokemon.length - 1;
}


function isLastIndexOfAllPokemon(index) {
    return index === totalNumberOfPokemon - 1;
}


async function isLastIndexOfSearchedPokemon(index) {
    return searchIsActive && await isLastSearchedName(index);
}


async function isLastSearchedName(index) {
    let searchedNames = await getSearchedPokemonNames(searchString);
    return getLoadedPokemonName(index) === searchedNames.at(-1);
}


function turnHeightIntoCM(height) {
    return height * 10;
}


function turnWeightIntoKG(height) {
    return (height / 10).toFixed(1);
}







function setCardColors(index) {
    const firstType = getLoadedPokemonType(index, 0);

    document.getElementById('pokecard-header').className = 'pokecard-header bg-' + firstType;

    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        document.getElementsByClassName('pokemon-types')[i].className = 'pokemon-types light-bg-' + firstType;
    }

    for (let i = 0; i < loadedPokemon[index]['stats'].length; i++) {
        document.getElementsByClassName('progress-bar')[i].className = 'progress-bar progress-bar-striped bg-' + firstType;
    }

    for (let i = 0; i < loadedPokemon[index]['moves'].length; i++) {
        const bgClass = isEven(i) ? `verylight-bg-${firstType}` : `ultralight-bg-${firstType}`;
        document.getElementById(`move-${index}-${i}`).className = bgClass;
    }
}


function isEven(n) {
    return n % 2 == 0;
}


function isOdd(n) {
    return Math.abs(n % 2) == 1;
}


function doNotClose(event) {
    event.stopPropagation();
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