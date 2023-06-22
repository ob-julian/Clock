const themeLang = ["Browser", "Hell", "Dunkel"];

let lastTime = "";

function getTimeAsText() {
    const timeText = getTimeAsGermanText();
    return timeText.toLowerCase().replace("dreiviertel", "drei_min viertel");
}

function getTimeAsGermanText() {
    const now = new Date();
    // const now = createDate(); //debugging
    let hour = now.getHours();
    // convert 24h to 12h
    if(hour > 12)
        hour -= 12;
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
        if(lastTime === `Es ist Dreiviertel ${convertToGermanText(hour + 1)}.split` || lastTime === `Es ist Viertel vor ${convertToGermanText(hour + 1)}`)
            return lastTime;
        // flip coin for how to say it
        else if(Math.random() < 0.5)
            timeText = `Es ist Viertel vor ${convertToGermanText(hour + 1)}`;
        else
            timeText = `Es ist Dreiviertel ${convertToGermanText(hour + 1)}`;
    else if(minute < 30)
        timeText = `Es ist ${convertToGermanText(minute)}_min nach ${convertToGermanText(hour)}`;
    else
        timeText = `Es ist ${convertToGermanText(60 - minute)}_min vor ${convertToGermanText(hour + 1)}`;
    
    
    return timeText;
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