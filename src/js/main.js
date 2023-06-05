let lastTimeAsText = [];
let updating = false;

function getTimeAsText() {
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
            timeText = `Es ist ${convertToText(hour)} Uhr`;
    else if(minute === 15)
        timeText = `Es ist Viertel nach ${convertToText(hour)}`;
    else if(minute === 25)
        timeText = `Es ist fünf_min vor halb ${convertToText(hour + 1)}`;
    else if(minute === 30)
        timeText = `Es ist halb ${convertToText(hour + 1)}`;
    else if(minute === 35)
        timeText = `Es ist fünf_min nach halb ${convertToText(hour + 1)}`;
    else if(minute === 45)
        // flip coin for how to say it
        if(Math.random() < 0.5)
            timeText = `Es ist Viertel vor ${convertToText(hour + 1)}`;
        else
            timeText = `Es ist Dreiviertel ${convertToText(hour)}`;
    else if(minute < 30)
        timeText = `Es ist ${convertToText(minute)}_min nach ${convertToText(hour)}`;
    else
        timeText = `Es ist ${convertToText(60 - minute)}_min vor ${convertToText(hour + 1)}`;
    
    
    return [timeText, am];
}

function convertToText(number) {
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
      20: "Zwanzig",
    };
  
    if (number in germanNumbers) {
      return germanNumbers[number];
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

  
// "Game loop"
function update() {
    if (updating) {
        return;
    }
    updating = true;
    const timeText = getTimeAsText();
    console.log(timeText[0]);
    const am = timeText[1];
    const time = timeText[0].toLowerCase().replace("dreiviertel", "drei_min viertel");
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

    update();
    // Update every 1 minute
    setInterval(update, 1000 * 60);
}


//for testing/debugging
let i = 0;
function createDate() {
    let minute = i % 60;
    let hour = Math.floor(i / 60);
    console.log(hour + ":" + minute);
    i += 5;
    return new Date(2022, 1, 1, hour, minute);
}