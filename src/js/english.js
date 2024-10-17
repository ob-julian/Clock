const themeLang = ["Browser", "Light", "Dark"]

function getTimeAsText() {
    const timeText = getTimeAsEnglishText();
    return timeText.toLowerCase().replace("o'clock", "oclock");
}

function getTimeAsEnglishText() {
    const now = new Date();
    let hour = now.getHours();
    // convert 24h to 12h
    if(hour > 12)
        hour -= 12;
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

    return timeText;
}

function convertToEnglishText(number) {
    const englishNumbers = {
        0: "Twelve", //English is weird
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
        13: "One", //To prevent out of bounds
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