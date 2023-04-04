let loadedPokemonForSearch = [];
let searchString = '';

async function search() {
    searchIsActive = true;
    searchString = document.getElementById('search-input').value.toLowerCase();

    showLoadedPokemon();
    removeUnsearchedPokemon(searchString);
    await loadAndRenderFurtherSearchedPokemon(searchString);
    showElement('reset-btn');
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


async function loadAndRenderFurtherSearchedPokemon(searchString) {
    showElement('loader');
    await loadFurtherSearchedPokemon(searchString);
    concatenateLoadedPokemonArrays();
    // console.log('Loaded pokemon:', loadedPokemon);
    renderPokemon();
    numberOfRenderedPokemon += loadedPokemonForSearch.length;
    // console.log('#rendered pokemon:', numberOfRenderedPokemon);
    removeElement('loader');
}


async function loadFurtherSearchedPokemon(searchString, loadCount = LOAD_LIMIT) {
    loadedPokemonForSearch = [];
    let offset = loadedPokemon.length;
    let names = await getSearchedPokemonNames(searchString);

    // console.log('Searched names:', names);

    const searchedPokemonAlreadyLoaded = loadedPokemon.filter(obj => obj.name.toLowerCase().includes(searchString));

    let firstIndexToLoad = 0;
    if (searchedPokemonAlreadyLoaded.length) {
        firstIndexToLoad = names.indexOf(searchedPokemonAlreadyLoaded.at(-1)['name']) + 1;
    }
    const numberOfNamesToLoad = Math.min(names.length - firstIndexToLoad, loadCount);
    const lastIndexToLoadExcluded = firstIndexToLoad + numberOfNamesToLoad;
    let namesToLoad = names.slice(firstIndexToLoad, lastIndexToLoadExcluded)
    // console.log('Searched names to load:', namesToLoad);

    for (let i = 0; i < namesToLoad.length; i++) {
        const url = getPokemonDetailsURL(namesToLoad[i]);
        let pokemon = await fetchAsJson(url);
        loadedPokemonForSearch.push(pokemon);
    }
    // console.log('Searched pokemon:', loadedPokemonForSearch);
}


async function getSearchedPokemonNames(searchString, offset = 0, limit = totalNumberOfPokemon) {
    let names = await getPokemonNames(offset, limit);
    return names.filter(name => name.toLowerCase().includes(searchString));
}


async function getPokemonNames(offset = 0, limit = totalNumberOfPokemon) {
    let pokelist = await getShortlistOfNamesAndURLs(offset, limit);
    let names = [];

    for (let i = 0; i < pokelist['results'].length; i++) {
        names.push(pokelist['results'][i]['name']);
    }

    return names;
}


function concatenateLoadedPokemonArrays() {
    loadedPokemon = loadedPokemon.concat(loadedPokemonForSearch);
}


function closeSearch() {
    searchIsActive = false;
    document.getElementById('search-input').value = '';
    showLoadedPokemon();
    hideElement('reset-btn');
}


function showLoadedPokemon() {
    for (let i = 0; i < loadedPokemon.length; i++) {
        showElement(`pokebox-${i}`);
    }
}