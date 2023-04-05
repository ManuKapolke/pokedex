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
    renderPokecardBody(index);
}


/*--------------------------------------------------
Pokecard Header
---------------------------------------------------*/
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


/*--------------------------------------------------
Pokecard Body
---------------------------------------------------*/
function renderPokecardBody(index) {
    renderAboutTab(index);
    renderStatsTab(index);
    renderMovesTab(index);
}


function renderAboutTab(index) {
    document.getElementById('species').innerHTML = getLoadedPokemonSpecies(index);
    document.getElementById('height').innerHTML = `${getLoadedPokemonHeight(index)} cm`;
    document.getElementById('weight').innerHTML = `${getLoadedPokemonWeight(index)} kg`;
    document.getElementById('abilities').innerHTML = getLoadedPokemonAbilities(index).join(', ');
}


function renderStatsTab(index) {
    const stats = getLoadedPokemonStats(index);
    clearElement('stats-table');
    for (let i = 0; i < stats.length; i++) {
        document.getElementById('stats-table').innerHTML += `
            <tr>
                <th>${stats[i].name}</th>
                <td>${stats[i].value}</td>
                <td>
                    <div class="progress" role="progressbar">
                        <div class="progress-bar progress-bar-striped bg-danger" style="width:${stats[i].percent}%">
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }
}


function renderMovesTab(index) {
    const moves = getLoadedPokemonMoves(index);
    clearElement('moves-container');
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        document.getElementById('moves-container').innerHTML += `<div id="move-${index}-${i}">${move}</div>`;
    }
}


/*--------------------------------------------------
Pokecard Colors
---------------------------------------------------*/
function setCardColors(index) {
    setCardBackgroundOfHeader(index);
    setCardBackgroundOfTypes(index);
    setCardBackgroundOfStats(index);
    setCardBackgroundOfMoves(index);
}


function setCardBackgroundOfHeader(index) {
    const types = getLoadedPokemonTypes(index);
    const firstType = types[0];
    document.getElementById('pokecard-header').className = `pokecard-header bg-${firstType}`;
}


function setCardBackgroundOfTypes(index) {
    const types = getLoadedPokemonTypes(index);
    const firstType = types[0];

    for (let i = 0; i < types.length; i++) {
        document.getElementsByClassName('pokemon-types')[i].className = `pokemon-types light-bg-${firstType}`;
    }
}


function setCardBackgroundOfStats(index) {
    const stats = getLoadedPokemonStats(index);
    const types = getLoadedPokemonTypes(index);
    const firstType = types[0];

    for (let i = 0; i < stats.length; i++) {
        document.getElementsByClassName('progress-bar')[i].className = `progress-bar progress-bar-striped bg-${firstType}`;
    }
}


function setCardBackgroundOfMoves(index) {
    const moves = getLoadedPokemonMoves(index);
    const types = getLoadedPokemonTypes(index);
    const firstType = types[0];

    for (let i = 0; i < moves.length; i++) {
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
