// Dankjewel https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let monthDays = [];

const months = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];

let monthAndYear = document.getElementById("monthAndYear");
changeCalendar(currentMonth, currentYear);

function initCalendarButtons() {
    document.getElementById("kalender-prev").addEventListener("click", previous);
    document.getElementById("kalender-next").addEventListener("click", next);
}

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    changeCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    changeCalendar(currentMonth, currentYear);
}

function changeCalendar(month, year) {
    let date = `1-${month+1}-${year}`;

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            renderCalendar(month, year, JSON.parse(this.responseText));
        }
    };
    request.open("GET", `DBjs.php?t=3&d=${date}`, true);
    request.send();
}
// gooi table met rijen, kolommen als weken, weekdagen in #kalender-body op basis van maand en jaar
// grotendeels van het artikel bovenaan gecomment
function renderCalendar(month, year, monthdays) {
    let firstDay = (new Date(year, month)).getDay();
    let tbl = document.getElementById("kalender-body");
    let date = 1;

    tbl.innerHTML = "";

    let displayDate = `${months[month]} ${year}`;
    document.getElementById("kalender-date-desc").textContent = displayDate;

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                let cellOuter = document.createElement("td");
                let cell = document.createElement("input");
                cell.setAttribute("type", "button");
                let cellId = `${date}`;
                let cellOpen = monthdays[date - 1];
                cell.setAttribute("value", date.toString());

                cell.setAttribute("id", cellId);
                if (cellOpen) { // indien er vandaag openingstijden zijn
                    cell.setAttribute("class", "dateCellOpen");
                    cell.addEventListener("click", function(){
                        getDate(year, month + 1, cellId);
                        setSelected(cellId);
                    })
                }
                else {
                    cell.setAttribute("class", "dateCellClosed");
                    cell.setAttribute("disabled", "");
                }

                cellOuter.appendChild(cell);
                row.appendChild(cellOuter);
                date++;
            }

        }
        tbl.appendChild(row);
    }
}

function daysInMonth(iMonth, iYear)
{
    let tempDate = new Date(iYear, iMonth, 32).getDate();
    return 32 - tempDate;
}

function getDate(year, month, day) {
    let date = `${day}-${month}-${year}`;

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            upDate(JSON.parse(this.responseText));
        }
    };
    request.open("GET", `DBjs.php?t=2&d=${date}`, true);
    request.send();
}

// func(cell, row) wordt op elke geldige cel van de kalender uitgevoerd
function forEachDatecell(func) {
    let cal = document.getElementById("kalender-body");
    let calRows = cal.childNodes;
    for (let i = 0; i < calRows.length; i++) {
        let row = calRows[i];
        let cells = row.childNodes;
        for (let j = 0; j < cells.length; j++) {
            let cell = cells[j];
            if (cell.children.length > 0) {
                func(cell.children[0], row);
            }
        }
    }
}
// update welke cell er geselecteerd staat zodat deze met CSS kan worden gemarkeerd
// overzichtelijker dan '7 februari' uitschrijven en de gebruiker laten lezen
function setSelected(id) {
    forEachDatecell(function(cell, row){
        if (cell.id === id) {
            cell.classList.add('selected');
        }
        else cell.classList.remove('selected');
    });
}
// misschien had een 'forEachRadio' overzichtelijker geweest maar het wordt toch maar 1 keer gebruikt
// geeft net zoals setSelected een knop aan om vervolgens met CSS overzichtelijk te markeren
function radioChange() {
    let fullList = document.getElementById("time-select");
    let listElements = fullList.childNodes;
    console.log("ja");
    for (let i = 0; i < listElements.length; i++) {
        let el = listElements[i];
        let elChildren = el.childNodes;
        for (let j = 0; j < elChildren.length; j++) {
            let child = elChildren[j];
            if (child.tagName === "INPUT") {
                if (child.checked) {
                    el.classList.add("selected");
                } else {
                    el.classList.remove("selected");
                }
            }
        }
    }
}
// maakt een [11:30] knop en voegt het toe aan #time-select (11:30 is dynamisch, uiteraard)
function createTimeRadio(time) {
    let timeDate = new Date(time * 1000);
    let timeMin = timeDate.getMinutes() == 0 ? '00' : timeDate.getMinutes();
    let timeDisplay = `${timeDate.getHours()}:${timeMin}`;
    let timeId = `time-${timeDisplay}`;

    let listItem = document.createElement("li");
    listItem.setAttribute("for", timeId);

    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("class", "timeRadio");
    radio.setAttribute("name", "selectedTime");
    radio.setAttribute("id", timeId);
    radio.setAttribute("value", time);
    radio.addEventListener("change", radioChange)

    let label = document.createElement("label");
    label.textContent = timeDisplay;
    label.setAttribute("for", timeId);

    listItem.appendChild(radio);
    listItem.appendChild(label);
    document.getElementById("time-select").appendChild(listItem);
}
// voegt de knoppen toe om te kiezen hoe laat je een afspraak wilt maken
function upDate(open) {
    const timeInterval = 1800; // hoeveel seconden moeten er tussen elke twee knoppen zitten

    for (let i = 0; i < open.length; i++) {
        let t = open[i];
        let tStart = parseInt(t['start']);
        let tEnd = parseInt(t['end']);

        let tDiff = tEnd - tStart;
        let tIter = Math.floor(tDiff / timeInterval);

        document.getElementById("time-select").innerHTML = "";
        for (let i = 0; i < tIter; i++) {
            createTimeRadio(tStart + i * timeInterval);
        }

        let start = new Date(tStart * 1000);
        let end = new Date(tEnd * 1000);

        document.getElementById("afspraak-selected-date").textContent = `${start.getDate()} ${months[start.getMonth()]}`;

        console.log(`Op ${start.getDate()} ${months[start.getMonth()]} open van ${start.getHours()} tot ${end.getHours()}`)
    }
}
// func(checkbox, behandeling) wordt op elke behandeling-checkbox uitgevoerd
function forEachCheck(func) {
    let behandelingen = document.getElementsByClassName("behandeling");
    for (let i = 0; i < behandelingen.length; i++) {
        let behandeling = behandelingen[i];
        let behandelChildren = behandeling.childNodes;
        for (let j = 0; j < behandelChildren.length; j++) {
            let checkbox = behandelChildren[j]
            if (checkbox.tagName === "INPUT") {
                func(checkbox, behandeling);
            }
        }
    }
}
// geef element aan om met CSS te markeren
function checkChange() {
    forEachCheck(function(check, checkParent){
        if (check.checked) {
            checkParent.classList.add("selected");
        } else {
            checkParent.classList.remove("selected");
        }
    });
}
// initialize afspraak-checkbox eventListeners
function initChecks() {
    forEachCheck(function(check, checkParent){
        check.addEventListener("change", checkChange);
    });
}

initChecks();
initCalendarButtons();