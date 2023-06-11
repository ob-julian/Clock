let lastTimeAsText = [];
let updating = false;
let show = "seconds"; // seconds, time

function getTimeAsGermanText() {
    const now = new Date();
    // const now = createDate(); //debugging
    let hour = now.getHours();
    // convert 24h to 12h
    let am = true;
    if(hour > 12){
        hour -= 12;
        am = false;
    }
    let minute = now.getMinutes();
    // ceil minutes to next mod 5
    minute = Math.floor(minute / 5) * 5;
  
    let timeText = "";
  
    if(minute === 0)
        if(hour === 1)
            timeText = `Es ist Ein Uhr`;
        else
            timeText = `Es ist ${convertToGermanText(hour)} Uhr`;
    else if(minute === 15)
        timeText = `Es ist Viertel nach ${convertToGermanText(hour)}`;
    else if(minute === 25)
        timeText = `Es ist fünf_min vor halb ${convertToGermanText(hour + 1)}`;
    else if(minute === 30)
        timeText = `Es ist halb ${convertToGermanText(hour + 1)}`;
    else if(minute === 35)
        timeText = `Es ist fünf_min nach halb ${convertToGermanText(hour + 1)}`;
    else if(minute === 45)
        if(lastTimeAsText === `Es ist Dreiviertel ${convertToGermanText(hour)}` || lastTimeAsText === `Es ist Viertel vor ${convertToGermanText(hour + 1)}`)
            return [lastTimeAsText, am]
        // flip coin for how to say it
        else if(Math.random() < 0.5)
            timeText = `Es ist Viertel vor ${convertToGermanText(hour + 1)}`;
        else
            timeText = `Es ist Dreiviertel ${convertToGermanText(hour)}`;
    else if(minute < 30)
        timeText = `Es ist ${convertToGermanText(minute)}_min nach ${convertToGermanText(hour)}`;
    else
        timeText = `Es ist ${convertToGermanText(60 - minute)}_min vor ${convertToGermanText(hour + 1)}`;
    
    
    return [timeText, am];
}

function convertToGermanText(number) {
    const germanNumbers = {
      0: "Zwölf", //Hust Hust 12 Uhr = 0 Uhr Hust Hust
      1: "Eins",
      2: "Zwei",
      3: "Drei",
      4: "Vier",
      5: "Fünf",
      6: "Sechs",
      7: "Sieben",
      8: "Acht",
      9: "Neun",
      10: "Zehn",
      11: "Elf",
      12: "Zwölf",
      13: "Eins", //Hust Hust 13 Uhr = 1 Uhr Hust Hust
      20: "Zwanzig",
    };
  
    if (number in germanNumbers) {
      return germanNumbers[number];
    } else {
        return number;
    }
}

function getTimeAsEnglishText() {
    const now = new Date();
    // const now = createDate(); //debugging
    let hour = now.getHours();
    // convert 24h to 12h
    let am = true;
    if(hour > 12){
        hour -= 12;
        am = false;
    }
    let minute = now.getMinutes();
    // ceil minutes to next mod 5
    minute = Math.floor(minute / 5) * 5;

    let timeText = "";

    if(minute === 0)
        timeText = `It is ${convertToEnglishText(hour)} o'clock`;
    else if(minute <= 30)
        timeText = `It is ${convertToEnglishText(minute)}_min past ${convertToEnglishText(hour)}`;
    else
        timeText = `It is ${convertToEnglishText(60 - minute)}_min to ${convertToEnglishText(hour + 1)}`;

    return [timeText, am];
}

function convertToEnglishText(number) {
    const englishNumbers = {
        0: "Twelve", //Hust Hust 12 Uhr = 0 Uhr Hust Hust
        1: "One",
        2: "Two",
        3: "Three",
        4: "Four",
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
        10: "Ten",
        11: "Eleven",
        12: "Twelve",
        13: "One", //Hust Hust 13 Uhr = 1 Uhr Hust Hust
        15: "Quarter",
        20: "Twenty",
        25: "Twentyfive",
        30: "Half",
        35: "Twentyfive",
        40: "Twenty",
        45: "Quarter",
        50: "Ten",
        55: "Five",
    };
    
    if (number in englishNumbers) {
        return englishNumbers[number];
    } else {
        return number;
    }
}

function compareArrays(array1, array2) {
    return array1.filter(function(item) {
      return !array2.includes(item);
    });
}

function changeCssClass(className, to) {
    const elements = document.getElementsByTagName("td")
    for (let element of elements) {
        if (element.classList.contains(className)) {
            element.style.color = to;
        }
    }
}

function updateTime() {
    if (updating) {
        return;
    }
    updating = true;
    let timeText;
    let time;
    if(document.getElementById("german") !== null) {
        timeText = getTimeAsGermanText();
        time = timeText[0].toLowerCase().replace("dreiviertel", "drei_min viertel");
    }
    else if(document.getElementById("english") !== null) {
        timeText = getTimeAsEnglishText();
        time = timeText[0].toLowerCase().replace("o'clock", "oclock");
    }
    console.log(timeText[0]);
    const am = timeText[1];
    const textElements = time.split(" ");

    const difference = compareArrays(lastTimeAsText, textElements);
    for (let element of difference) {
        //element is the name of the css class we want to edit
        changeCssClass(element, "var(--faint-text)");
    }

    const change = compareArrays(textElements, lastTimeAsText);
    for (let element of change) {
        //element is the name of the css class we want to edit
        changeCssClass(element, "var(--visible-text)");
    }

    changeCssClass("am", am ? "var(--neutral-color)" : "var(--faint-text)");
    changeCssClass("pm", am ? "var(--faint-text)" : "var(--neutral-color)");

    lastTimeAsText = textElements;
    updating = false;

    return difference.length > 0 || change.length > 0;
}

window.onload = function() {
    //get browser theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
    if(show == "time") {
        updateTime();
        setTimeout(interval5Min, milisecondsUntilNext5Minutes() + 1000);
    }
    else if(show == "seconds") {
        updateSeconds();
        setTimeout(interval1Sec, milisecondsUntilNextSecond() + 10);
    }
}

function interval5Min() {
    updateTime();
    setInterval(updateTime, 1000 * 60 * 5);
}

function interval1Sec() {
    updateSeconds();
    setInterval(updateSeconds, 1000);
}

function milisecondsUntilNext5Minutes() {
    const now = new Date();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    const miliseconds = now.getMilliseconds();
    const milisecondsUntilNext5Minutes = (5 - (minute % 5)) * 60 * 1000 - seconds * 1000 - miliseconds;
    return milisecondsUntilNext5Minutes;
}

function milisecondsUntilNextSecond() {
    const now = new Date();
    const miliseconds = now.getMilliseconds();
    const milisecondsUntilNextSecond = 1000 - miliseconds;
    return milisecondsUntilNextSecond;
}

function milisecondsToTime(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//for testing/debugging
let i = 60 * 12;
function createDate() {
    let minute = i % 60;
    let hour = Math.floor(i / 60);
    console.log(hour + ":" + minute);
    i += 5;
    return new Date(2022, 1, 1, hour, minute);
}



// experimental, show seconds


// each number is an array of 5x7
let number = new Array(10);

number[0] = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

number[1] = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0]
];

number[2] = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
];

number[3] = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

number[4] = [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0]
];

number[5] = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

number[6] = [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

number[7] = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0]
];

number[8] = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

number[9] = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 0]
];

function updateSeconds() {
    let table = document.getElementsByTagName("table")[0];
    // get possible tbody
    if(table.tBodies.length != 0) {
        table = table.tBodies[0];
    }
    let now = new Date();
    let seconds = now.getSeconds();
    let seconds1 = Math.floor(seconds / 10);
    let seconds2 = seconds % 10;
    let seconds1Array = number[seconds1];
    let seconds2Array = number[seconds2];
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 5; j++) {
            if (seconds1Array[i][j] == 1) {
                table.rows[i+2].cells[j].style.color = "var(--visible-text)";
            } else {
                table.rows[i+2].cells[j].style.color = "var(--faint-text)";
            }
            if (seconds2Array[i][j] == 1) {
                table.rows[i+2].cells[j + 6].style.color = "var(--visible-text)";
            } else {
                table.rows[i+2].cells[j + 6].style.color = "var(--faint-text)";
            }
        }
    }
}

function resetCss() {
    let table = document.getElementsByTagName("table")[0];
    // get possible tbody
    if(table.tBodies.length != 0) {
        table = table.tBodies[0];
    }

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = 0; j < table.rows[i].cells.length; j++) {
            table.rows[i].cells[j].style.color = "var(--faint-text)";
        }
    }
}