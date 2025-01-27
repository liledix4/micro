document.querySelector('body').focus();
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    const pressedKey = event.code;
    console.log(pressedKey);
});
document.addEventListener('keyup', (event) => {
    event.preventDefault();
    const pressedKey = event.code;
    console.log(pressedKey);
});