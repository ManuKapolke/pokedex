const LOAD_LIMIT = 20;
const LBS_IN_KG = 0.453592;
const FT_IN_CM = 30.48;
const MAX_STAT_VALUE = 160;
const MOVES_FITTING_WITHOUT_SCROLLBAR = 12;
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
Load/Render On Scroll
---------------------------------------------------*/
window.onscroll = async function () {
    const currentBottom = document.documentElement.scrollTop + window.innerHeight;
    const maxHeight = document.body.scrollHeight;

    if (currentBottom == maxHeight && loadedPokemon.length < totalNumberOfPokemon) {
        loadAndRenderFurtherPokemon();
    }
};

function loadAndRenderFurtherPokemon() {
    if (searchIsActive)
        loadAndRenderFurtherSearchedPokemon();
    else
        loadAndRenderPokemon();
}