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