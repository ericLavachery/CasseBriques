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

if (getParamByName('brk1') != '' && getParamByName('brk1') != null) {
    var newStage = [];
    var i = 0;
    while (i < 27) {
        o = i+1;
        newStage[i] = getParamByName('brk'+o);
        i = i + 1;
        if (i >= 100) {break;}
    }
    var level = newStage;
    console.log(level);
}
