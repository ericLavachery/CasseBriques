function checkFilled(zeid) {
    var inputVal = document.getElementById(zeid);
    if (inputVal.value == "b") {
        inputVal.style.backgroundColor = "#E23232";
    } else {
        if (inputVal.value == "h") {
            inputVal.style.backgroundColor = "#770101";
        } else {
            if (inputVal.value == "m") {
                inputVal.style.backgroundColor = "#000000";
            } else {
                inputVal.style.backgroundColor = "blue";
            }
        }
    }
}
