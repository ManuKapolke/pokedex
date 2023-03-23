const LOAD_LIMIT = 20;
const loadedPokemon = [];
let numberOfRenderedPokemon = 0;
let totalNumberOfPokemon;
const LBS_IN_KG = 0.453592;
const FT_IN_CM = 30.48;
let searchIsActive = false;


async function loadAndRenderPokemon() {
    showElement('loader');
    await loadPokemon();
    renderPokemon();
    removeElement('loader');
}


async function loadPokemon(offset = loadedPokemon.length, limit = LOAD_LIMIT) {
    const urlForShortList = getPokemonURL(offset, limit);
    let responseShortList = await fetch(urlForShortList);
    let shortListAsJson = await responseShortList.json();

    totalNumberOfPokemon = shortListAsJson['count'];

    for (let i = 0; i < shortListAsJson['results'].length; i++) {
        const url = shortListAsJson['results'][i]['url'];
        let responsePokemon = await fetch(url);
        let pokemonAsJson = await responsePokemon.json();
        loadedPokemon.push(pokemonAsJson);
    }

    console.log('Loaded Pokemon:', loadedPokemon);
}


function renderPokemon() {
    let startIndex = numberOfRenderedPokemon;
    for (let i = startIndex; i < loadedPokemon.length; i++) {
        renderPokebox(i);
    }
    for (let i = startIndex; i < loadedPokemon.length; i++) {
        setBoxColors(i);
    }
    numberOfRenderedPokemon += LOAD_LIMIT;
}


function renderPokebox(index) {
    const container = document.getElementById('all-pokemon-container');
    container.innerHTML += getPokeboxHtmlFrame(index);

    document.getElementById('pokebox-name-' + index).innerHTML = capitalizeFirstLetter(loadedPokemon[index]['name']);

    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        const type = capitalizeFirstLetter(getType(index, i));
        document.getElementById('pokebox-types-' + index).innerHTML += `<div class="pokebox-type-${index}">${type}</div>`;
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


function setBoxColors(index) {
    let type = getFirstType(index);

    document.getElementById('pokebox-' + index).classList.add('bg-' + type);

    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        document.getElementsByClassName('pokebox-type-' + index)[i].classList.add('light-bg-' + type);
    }
}


// function renderLoader() {
//     document.getElementById('body').innerHTML += `
//         <div class="wrapper">
//             <div class="circle"></div>
//             <div class="circle"></div>
//             <div class="circle"></div>
//             <div class="shadow"></div>
//             <div class="shadow"></div>
//             <div class="shadow"></div>
//             <span>Loading</span>
//         </div>
//     `;
// }


function setCardColors(index) {
    let type = getFirstType(index);

    document.getElementById('pokecard-header').className = 'pokecard-header bg-' + type;

    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        document.getElementsByClassName('pokemon-type')[i].className = 'pokemon-type light-bg-' + type;
    }

    for (let i = 0; i < loadedPokemon[index]['stats'].length; i++) {
        document.getElementsByClassName('progress-bar')[i].className = 'progress-bar progress-bar-striped bg-' + type;
    }

    for (let i = 0; i < loadedPokemon[index]['moves'].length; i++) {
        const bgClass = isEven(i) ? `verylight-bg-${type}` : `ultralight-bg-${type}`;
        document.getElementById(`move-${index}-${i}`).className = bgClass;
    }
}


function getFirstType(index) {
    return getType(index, 0);
}


function getType(index, typeIndex) {
    return loadedPokemon[index]['types'][typeIndex]['type']['name'];
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


function getPokemonNameURL(name) {
    return `https://pokeapi.co/api/v2/pokemon/${name}`;
}


window.onscroll = async function () {
    const current = document.documentElement.scrollTop + window.innerHeight;
    const maxHeight = document.body.scrollHeight;

    if (current == maxHeight) {
        if (!searchIsActive)
            loadAndRenderPokemon();
    }
};





function openSingleCard(index) {
    // removeElement('all-pokemon-container');
    document.getElementById('all-pokemon-container').style.opacity = 0.3;
    document.getElementById('body').classList.add('no-scrolling');
    showElement('single-pokemon-container');
    renderPokecard(index);
    setCardColors(index);

    // renderSingleCard(imgIndex);
}


function renderPokecard(index) {
    let pokemonName = capitalizeFirstLetter(loadedPokemon[index]['name']);
    document.getElementById('pokemon-name').innerHTML = pokemonName;
    // renderPokemonInfo();

    document.getElementById('pokemon-img').src = loadedPokemon[index]['sprites']['other']['official-artwork']['front_default'];
    // renderPokemonImage();

    document.getElementById('pokemon-types').innerHTML = '';
    for (let i = 0; i < loadedPokemon[index]['types'].length; i++) {
        const type = capitalizeFirstLetter(getType(index, i));
        document.getElementById('pokemon-types').innerHTML += `<div class="pokemon-type">${type}</div>`;
    }

    document.getElementById('pokemon-id').innerHTML = '#' + loadedPokemon[index]['id'].toString().padStart(4, '0');

    if (index === 0) {
        hideElement('previous-card');
    }
    else {
        showElement('previous-card');
        document.getElementById('previous-card').onclick = function () { openSingleCard(index - 1); }
    }
    if (index === loadedPokemon.length - 1) {
        showElement('next-card');
        document.getElementById('next-card').onclick = async function () { await loadAndRenderPokemon(); openSingleCard(index + 1); }
    }
    else {
        showElement('next-card');
        document.getElementById('next-card').onclick = function () { openSingleCard(index + 1); }
    }
    if (index === totalNumberOfPokemon - 1) {
        hideElement('next-card');
    }



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

        if (statValue > MAX_STAT_VALUE)
            console.warn('statValue = ', statValue, ' > MAX_STAT_VALUE');
    }

    // Moves
    document.getElementById('moves-container').innerHTML = '';
    for (let i = 0; i < loadedPokemon[index]['moves'].length; i++) {
        const move = loadedPokemon[index]['moves'][i]['move']['name'];
        document.getElementById('moves-container').innerHTML += `<div id="move-${index}-${i}">${move}</div>`;
    }



}


function turnHeightIntoCM(height) {
    return height * 10;
}


function turnWeightIntoKG(height) {
    return (height / 10).toFixed(1);
}



function closeSingleCard() {
    removeElement('single-pokemon-container');
    document.getElementById('all-pokemon-container').style.opacity = 1;
    document.getElementById('body').classList.remove('no-scrolling');
    // showElement('all-pokemon-container');
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


function clearElement(id) {
    document.getElementById(id).innerHTML = '';
}


function isEven(n) {
    return n % 2 == 0;
}


function isOdd(n) {
    return Math.abs(n % 2) == 1;
}


