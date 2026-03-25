// laden der sql.js Bibliothek
const sqlPromise = initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
});

// Wenn man auf den Button klickt
document.getElementById('load').addEventListener('click', async function() {
    const tableElement = document.getElementById('table');
    tableElement.innerHTML = "<tr><td>Lade Daten... Bitte warten.</td></tr>";

    try {
        // 1. Die Datenbank-Datei von der Website herunterladen
        const response = await fetch('Daten_Eva.db');
        const buffer = await response.arrayBuffer();
        const Uints = new Uint8Array(buffer);
        
        // 2. Datenbank im Speicher öffnen
        const SQL = await sqlPromise;
        const db = new SQL.Database(Uints);

        // 3. SQL-Abfrage ausführen also Movies
        const res = db.exec("SELECT title AS Titel, year AS Jahr, genre AS Genre, main_actor AS Hauptdarsteller, rating AS Bewertung FROM Movies");
        
        // 4. Tabelle anzeigen
        if (res.length > 0) {
            displayResults(res[0]);
        } else {
            tableElement.innerHTML = "<tr><td>Die Datenbank ist leer.</td></tr>";
        }
    } catch (error) {
        console.error("Fehler:", error);
        tableElement.innerHTML = "<tr><td>Fehler beim Laden der Datenbank. Hast du die Datei 'Daten_Eva.db' hochgeladen?</td></tr>";
    }
});

// Funktion, um die Daten als HTML-Tabelle zuzeigen
function displayResults(data) {
    const table = document.getElementById('table');
    
    // Header erstellen
    let html = "<thead><tr>";
    data.columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += "</tr></thead><tbody>";

    // Zeilen einfügen
    data.values.forEach(row => {
        html += "<tr>";
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody>";

    table.innerHTML = html;
}