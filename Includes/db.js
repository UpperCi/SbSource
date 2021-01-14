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

// function quickTimeslot(time) {
//     let slot = document.createElement('input');
//     slot.setAttribute('type','time');
//     slot.setAttribute('value',time);
//     return slot;
// }

async function delDate(id) {
    let url = `DBjs.php?t=1&tId=${id}&user=${USER}&pass=${PASS}`;
    await fetch(url);

    console.log(`verwijderen van timeslot ${id}`);
}

function upDate(open) {
    document.getElementById("timeslot-overzicht").innerHTML = '';

    for (let i = 0; i < open.length; i++) {
        let t = open[i];
        let timePeriod = getPeriodDisplay(parseInt(t['start']),parseInt(t['end']));

        let cal = quickElement('div','cal-timeslot-in','');
        cal.appendChild(quickElement('p','cal-timeslot-display', timePeriod));

        let calDel = quickElement('i',"far",'');
        calDel.classList.add('fa-trash-alt');
        calDel.id = t['id'];
        calDel.addEventListener('click', function(){
            delDate(calDel.id);
        })

        cal.appendChild(calDel);

        document.getElementById("timeslot-overzicht").appendChild(cal);

        // console.log(`Op ${start.getDate()} ${months[start.getMonth()]} open van ${start.getHours()} tot ${end.getHours()}`)
    }
}

async function updateAfspraakData(year, month, day) {
    let date = `${day}-${month}-${year}`;
    let url = `DBjs.php?t=0&d=${date}&user=${USER}&pass=${PASS}`;

    await fetch(url)
        .then(response => response.json())
        .then(data => updateAfspraken(data));
}

async function updateOpeningstijdData(year, month, day) {
    let date = `${day}-${month}-${year}`;
    let url = `DBjs.php?t=2&d=${date}`;

    await fetch(url)
        .then(response => response.json())
        .then(data => upDate(data));
}

function getDate(year, month, day) {
    updateAfspraakData(year, month, day);
    updateOpeningstijdData(year, month, day);
}


initAfspraken();
initCalendarButtons();