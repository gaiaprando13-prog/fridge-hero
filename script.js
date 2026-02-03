function trovaRicette() {
    // 1. Controllo se l'elemento messaggio esiste prima di toccarlo
    const msgElement = document.getElementById("messaggio");
    if (msgElement) msgElement.textContent = "";

    // 2. Prendi ingredienti
    const inputField = document.getElementById("ingredientiInput");
    if (!inputField) return; // Sicurezza

    inputField.blur(); // Nasconde la tastiera su mobile dopo la ricerca
    
    const input = inputField.value;
    const ingredientiUtente = input
        .toLowerCase()
        .split(",")
        .map(i => i.trim())
        .filter(i => i !== ""); // Evita spazi vuoti

    // 3. Puliamo i risultati
    const risultati = document.getElementById("risultati");
    if (!risultati) return;
    risultati.innerHTML = "";

    // Se l'input è vuoto, non cercare nulla
    if (ingredientiUtente.length === 0) {
        risultati.innerHTML = "<li class='recipe-card'>Inserisci almeno un ingrediente!</li>";
        return;
    }

    let ricetteTrovate = [];

    // Ricordati che 'ricette' deve essere definito nel file db-ricette.js
    ricette.forEach(ricetta => {
        let ingredientiInComune = 0;
        ricetta.ingredienti.forEach(ingrediente => {
            if (ingredientiUtente.includes(ingrediente.toLowerCase())) {
                ingredientiInComune++;
            }
        });

        const percentuale = Math.round((ingredientiInComune / ricetta.ingredienti.length) * 100);

        if (ingredientiInComune > 0) {
            ricetteTrovate.push({
                nome: ricetta.nome,
                percentuale: percentuale,
                mancanti: ricetta.ingredienti.filter(i => !ingredientiUtente.includes(i.toLowerCase()))
            });
        }
    });

    // Mostrare i risultati
    ricetteTrovate.sort((a, b) => b.percentuale - a.percentuale);

    if (ricetteTrovate.length === 0) {
        risultati.innerHTML = "<li class='recipe-card'>Nessuna ricetta trovata con questi ingredienti... 🍎</li>";
    } else {
        ricetteTrovate.forEach(r => {
            const li = document.createElement("li");
            li.className = "recipe-card";

            let colore = r.percentuale >= 80 ? "#38a169" : (r.percentuale >= 50 ? "#d69e2e" : "#e53e3e");

            li.innerHTML = `
                <div class="recipe-header">
                    <strong style="color:${colore}; font-size: 1.2rem;">${r.nome}</strong>
                </div>
                <div class="recipe-body" style="margin-top: 8px; color: #555;">
                    <div><strong>Fattibilità:</strong> ${r.percentuale}%</div>
                    <div style="font-size: 1.0rem; margin-top: 5px;">
                        <strong>Mancano:</strong> ${r.mancanti.length ? r.mancanti.join(", ") : "Nulla, hai tutto!"}
                    </div>
                </div>
            `;
            risultati.appendChild(li);
        });
    }
}



// 3️⃣ Funzioni aggiuntive (UX)
function svuota() {
    document.getElementById("ingredientiInput").value = "";
    document.getElementById("risultati").innerHTML = "";
    document.getElementById("messaggio").textContent = "";
}


// Click invio cerca ricette
const input = document.getElementById("ingredientiInput");

// Aggiunge l'ascoltatore per i tasti
input.addEventListener("keypress", function(event) {
    // Controlla se il tasto premuto è "Invio"
    if (event.key === "Enter") {
        // Impedisce il comportamento predefinito (es. ricaricare la pagina se fosse un form)
        event.preventDefault();
        // Attiva la funzione che hai già scritto
        trovaRicette();
    }
});



// Animazione placeholder
const inputElement = document.getElementById("ingredientiInput");
const suggerimenti = ["pomodori, funghi?", "formaggio?", "zucchine?", "pollo, prugne?"];
let charIndex = 0;
let sugIndex = 0;
let faseIniziale = true; // Per gestire la scritta "Cosa vedi?"

function animaPlaceholder() {
    let testoDaScrivere = faseIniziale ? "Cosa vedi?..." : "" + suggerimenti[sugIndex];
    
    if (charIndex < testoDaScrivere.length) {
        // Scrive il testo carattere per carattere
        inputElement.setAttribute("placeholder", testoDaScrivere.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(animaPlaceholder, 100); 
    } else {
        // Pausa dopo aver finito di scrivere
        if (faseIniziale) {
            setTimeout(() => {
                cancellaPlaceholder();
                faseIniziale = false; // Finita la domanda, passa agli esempi
            }, 1500);
        } else {
            setTimeout(cancellaPlaceholder, 1000);
        }
    }
}

function cancellaPlaceholder() {
    let testoAttuale = inputElement.getAttribute("placeholder");
    
    if (testoAttuale.length > 0) {
        // Cancella il testo carattere per carattere
        inputElement.setAttribute("placeholder", testoAttuale.substring(0, testoAttuale.length - 1));
        setTimeout(cancellaPlaceholder, 150);
    } else {
        // Una volta cancellato, resetta l'indice e passa al prossimo suggerimento
        charIndex = 0;
        if (!faseIniziale) {
            sugIndex = (sugIndex + 1) % suggerimenti.length;
        }
        setTimeout(animaPlaceholder, 150);
    }
}

// Avvia l'animazione al caricamento della pagina
window.onload = animaPlaceholder;