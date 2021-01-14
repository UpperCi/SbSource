// update de status van een afspraak in de database
function updateStatus(id, newStatus) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(`afspraak ${id} gezet naar status ${newStatus}`);
        }
    };
    let getUrl = `DBjs.php?t=4&user=${USER}&pass=${PASS}&id=${id}&status=${newStatus}`;
    request.open("GET", getUrl, true);
    request.send();
}
// geef de afspraak- accept en deny-knoppen functionaliteit
function initAfspraken() {
    let afspraken = document.getElementsByClassName("afspraak");

    for (let i = 0; i < afspraken.length; i++) {
        let afId = afspraken[i].id;
        let acceptBtn = afspraken[i].getElementsByClassName("afspraak-accept")[0];
        acceptBtn.addEventListener("click", function(){
            updateStatus(afId, 1); // update afspraak-status -> 1 = geaccepteerd
            document.getElementById(afId).remove();
        });
        let denyBtn = afspraken[i].getElementsByClassName("afspraak-deny")[0];
        denyBtn.addEventListener("click", function(){
            updateStatus(afId, 2); // update afspraak-status -> 2 = geweigerd
            document.getElementById(afId).remove();
        });
    }
}

// Kalender komt eraan --------------------------------------------------
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

function getTimeDisplay(time) {
    let timeDate = new Date(time * 1000);
    let timeMin = timeDate.getMinutes() === 0 ? '00' : timeDate.getMinutes();
    return `${timeDate.getHours()}:${timeMin}`;
}

function getPeriodDisplay(start, end) {
    let startDisplay = getTimeDisplay(start);
    let endDisplay = getTimeDisplay(end);
    return `${startDisplay} - ${endDisplay}`;
}

function quickElement(elTag, elClass, elText) {
    let el = document.createElement(elTag);
    el.classList.add(elClass);
    el.innerText = elText;
    return el;
}

function createAfLink(afObj) {
    let afLink = document.createElement("div");
    afLink.classList.add('afspraak-overzicht-container');

    let disp = getPeriodDisplay(afObj['start'], afObj['end']);
    let tracker = afObj['tracker_id'];
    let url = 'afspraakTracker.php?af=' + tracker;

    afLink.appendChild(quickElement('p','afspraak-periode',disp));
    afLink.appendChild(quickElement('p','afspraak-email',afObj['email']));
    let details = quickElement('a','afspraak-link','details');
    details.setAttribute('href',url);
    afLink.appendChild(details);

    document.getElementById('afspraken').appendChild(afLink);
}

function updateAfspraken(af) {
    let afDiv = document.getElementById('afspraken');
    afDiv.innerHTML = "";

    for (let i = 0; i < af.length; i++) {
        createAfLink(af[i]);
    }
}

async function updateAfspraakData(year, month, day) {
    let date = `${day}-${month}-${year}`;
    let url = `DBjs.php?t=0&d=${date}&user=${USER}&pass=${PASS}`;

    await fetch(url)
        .then(response => response.json())
        .then(data => updateAfspraken(data));
}

function getDate(year, month, day) {
    let date = `${day}-${month}-${year}`;

    updateAfspraakData(year, month, day);

    // let request = new XMLHttpRequest();
    // request.onreadystatechange = function() {
    //     if (this.readyState === 4 && this.status === 200) {
    //         updateAfspraken(JSON.parse(this.responseText));
    //     }
    // };
    // request.open("GET", `DBjs.php?t=0&d=${date}&user=${USER}&pass=${PASS}`, true);
    // request.send();


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


initAfspraken();
initCalendarButtons();