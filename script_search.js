/*-------------------------------------
Search
--------------------------------------*/
let loadedPokemonForSearch = []; // TODO: doch alles bei loadedPokemon hinzufügen und dann in closeSearch() wieder rausschmeißen
// Nachladen für Suche mit vielen Ergebnissen?

async function search() {
    searchIsActive = true;
    let searchString = document.getElementById('search-input').value.toLowerCase();

    // resetLoadedPokemonArray();
    showLoadedPokemon();
    showElement('loader');
    removeUnsearchedPokemon(searchString);
    await loadFurtherSearchedPokemon(searchString);
    concatenateLoadedPokemonArrays();
    console.log('Loaded pokemon:', loadedPokemon);
    // renderFurtherSearchedPokemon(searchString);
    renderPokemon();
    numberOfRenderedPokemon += loadedPokemonForSearch.length;
    console.log('#rendered pokemon:', numberOfRenderedPokemon);
    showElement('reset-btn');
    removeElement('loader');
}


function removeUnsearchedPokemon(searchString) {
    const pokemonToRemove = getUnsearchedPokemonToRemove(searchString);

    for (let i = 0; i < pokemonToRemove.length; i++) {
        const index = loadedPokemon.indexOf(pokemonToRemove[i]);
        removeElement(`pokebox-${index}`);
    }
}


function getUnsearchedPokemonToRemove(searchString) {
    return loadedPokemon.filter(obj =>
        !obj.name.toLowerCase().includes(searchString)
    )
}


async function loadFurtherSearchedPokemon(searchString) {
    let names = await getSearchedPokemonNames(searchString);
    loadedPokemonForSearch = [];
    console.log('Searched names:', names);

    for (let i = 0; i < names.length; i++) {
        const url = getPokemonNameURL(names[i]);
        let responsePokemon = await fetch(url);
        let pokemonAsJson = await responsePokemon.json();
        loadedPokemonForSearch.push(pokemonAsJson);
    }
    console.log('Searched pokemon:', loadedPokemonForSearch);
}


async function getSearchedPokemonNames(searchString) {
    let names = await getAllPokemonNames();
    return names.filter(name => name.toLowerCase().includes(searchString));
}


async function getAllPokemonNames() {
    const url = getPokemonURL(loadedPokemon.length, totalNumberOfPokemon);
    let responseAllNames = await fetch(url);
    let AllNamesAsJson = await responseAllNames.json();
    let names = [];

    for (let i = 0; i < AllNamesAsJson['results'].length; i++) {
        names.push(AllNamesAsJson['results'][i]['name']);
    }

    return names;
}


function concatenateLoadedPokemonArrays() {
    loadedPokemon = loadedPokemon.concat(loadedPokemonForSearch);
}


// function renderFurtherSearchedPokemon(searchString) {
//     for (let i = 0; i < loadedPokemonForSearch.length; i++) {
//         renderPokeboxForSearch(i);
//     }
//     for (let i = 0; i < loadedPokemonForSearch.length; i++) {
//         setBoxColorsForSearch(i);
//     }
// }


// function renderPokeboxForSearch(index) {
//     const container = document.getElementById('all-pokemon-container');
//     let idIndex = loadedPokemon.length + index;

//     container.innerHTML += getPokeboxHtmlFrame(idIndex);

//     document.getElementById('pokebox-name-' + idIndex).innerHTML = capitalizeFirstLetter(loadedPokemonForSearch[index]['name']);

//     for (let i = 0; i < loadedPokemonForSearch[index]['types'].length; i++) {
//         const type = capitalizeFirstLetter(getTypeForSearch(index, i));
//         document.getElementById('pokebox-types-' + idIndex).innerHTML += `<div class="pokebox-type-${idIndex}">${type}</div>`;
//     }

//     document.getElementById('pokebox-id-' + idIndex).innerHTML = '#' + loadedPokemonForSearch[index]['id'].toString().padStart(4, '0');

//     document.getElementById('pokebox-img-' + idIndex).src = loadedPokemonForSearch[index]['sprites']['other']['official-artwork']['front_default'];


// }


// function getTypeForSearch(index, typeIndex) {
//     return loadedPokemonForSearch[index]['types'][typeIndex]['type']['name'];
// }


// function setBoxColorsForSearch(index) {
//     let type = getTypeForSearch(index, 0);
//     let idIndex = loadedPokemon.length + index;

//     document.getElementById('pokebox-' + idIndex).classList.add('bg-' + type);

//     for (let i = 0; i < loadedPokemonForSearch[index]['types'].length; i++) {
//         document.getElementsByClassName('pokebox-type-' + idIndex)[i].classList.add('light-bg-' + type);
//     }
// }


function closeSearch() {
    searchIsActive = false;
    document.getElementById('search-input').value = '';
    // clearElement('all-pokemon-container');
    showLoadedPokemon();
    hideElement('reset-btn');
}


function showLoadedPokemon() {
    for (let i = 0; i < loadedPokemon.length; i++) {
        showElement(`pokebox-${i}`);
    }
}