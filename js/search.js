let reloadedPokemonForSearch = [];
let searchString = '';
let searchedPokemonNames = [];
let numberOfSearchResults = 0;


async function search() {
    searchIsActive = true;
    searchString = document.getElementById('search-input').value.toLowerCase();
    searchedPokemonNames = await getSearchedPokemonNames();
    numberOfSearchResults = searchedPokemonNames.length;

    showLoadedPokemon();
    removeUnsearchedPokemon();

    if (numberOfSearchResults === 0) {
        document.getElementById('no-search-results').innerHTML = `There is no Pokémon with <i>${searchString}</i> in its name...`;
        showElement('no-search-results');
    } else {
        await loadAndRenderFurtherSearchedPokemon();
    }

    showElement('reset-btn');
}


async function getSearchedPokemonNames(offset = 0, limit = totalNumberOfPokemon) {
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


function showLoadedPokemon() {
    removeElement('no-search-results');

    for (let i = 0; i < loadedPokemon.length; i++) {
        showElement(`pokebox-${i}`);
    }
}


function removeUnsearchedPokemon() {
    getUnsearchedPokemonToRemove().forEach(pokemon => {
        const index = loadedPokemon.indexOf(pokemon);
        removeElement(`pokebox-${index}`);
    });
}


function getUnsearchedPokemonToRemove() {
    return loadedPokemon.filter(obj =>
        !obj.name.toLowerCase().includes(searchString)
    )
}


async function loadAndRenderFurtherSearchedPokemon() {
    showElement('loader');
    await loadFurtherSearchedPokemon();
    concatenateLoadedPokemonArrays();
    renderPokemon();
    removeElement('loader');
    numberOfRenderedPokemon += reloadedPokemonForSearch.length;
}


async function loadFurtherSearchedPokemon(loadCount = LOAD_LIMIT) {
    reloadedPokemonForSearch = [];
    let namesToLoad = await getUnloadedSearchedPokemonNames(loadCount);

    for (let i = 0; i < namesToLoad.length; i++) {
        const url = getPokemonDetailsURL(namesToLoad[i]);
        let pokemon = await fetchAsJson(url);
        reloadedPokemonForSearch.push(pokemon);
    }
}


async function getUnloadedSearchedPokemonNames(loadCount = LOAD_LIMIT) {
    const names = searchedPokemonNames;
    const firstIndex = getFirstIndexToLoad(names);
    const lastIndexExcluded = getLastIndexToLoadExcluded(names, firstIndex, loadCount);
    return names.slice(firstIndex, lastIndexExcluded);
}


function getFirstIndexToLoad(names) {
    const loadedSearchedPokemon = getLoadedSearchedPokemon();
    let firstIndexToLoad = 0;
    if (loadedSearchedPokemon.length) {
        firstIndexToLoad = names.indexOf(loadedSearchedPokemon.at(-1)['name']) + 1;
    }
    return firstIndexToLoad;
}


function getLoadedSearchedPokemon() {
    return loadedPokemon.filter(obj => obj.name.toLowerCase().includes(searchString));
}


function getLastIndexToLoadExcluded(names, firstIndexToLoad, loadCount) {
    const numberOfNamesToLoad = Math.min(names.length - firstIndexToLoad, loadCount);
    return firstIndexToLoad + numberOfNamesToLoad;
}


function concatenateLoadedPokemonArrays() {
    loadedPokemon = loadedPokemon.concat(reloadedPokemonForSearch);
}


function closeSearch() {
    searchIsActive = false;
    document.getElementById('search-input').value = '';
    showLoadedPokemon();
    hideElement('reset-btn');
}