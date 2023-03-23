function triggerButtonOnEnter(inputID, buttonID) {
    let input = document.getElementById(inputID);
    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById(buttonID).click();
        }
    });
}
triggerButtonOnEnter('search-input', 'search-btn')