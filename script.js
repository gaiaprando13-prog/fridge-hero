// 1. "Database" di ricette (finto, ma realistico)
const ricette = [
    {
        nome: "Pasta al pomodoro",
        ingredienti: ["pasta", "pomodori", "olio"]
    },
    {
        nome: "Frittata",
        ingredienti: ["uova", "formaggio"]
    },
    {
        nome: "Insalata mista",
        ingredienti: ["lattuga", "pomodori", "olio"]
    }
    {
        nome: "Pasta al ragù",
        ingredienti: ["pasta", "pomodori", "carne", "olio"]
    }
];




// 2. Funzione che parte quando clicchi il bottone
function trovaRicette() {
    document.getElementById("messaggio").textContent = "";

    // Step 2a: Prendi ingredienti dall'input
    const input = document.getElementById("ingredientiInput").value;

    const ingredientiUtente = input
        .toLowerCase()
        .split(",")
        .map(i => i.trim());

    // Step 2b: Puliamo i risultati precedenti
    const risultati = document.getElementById("risultati");
    risultati.innerHTML = "";


    // Step 2c: Calcolo compatibilità per ogni ricetta
    let ricetteTrovate = [];

    ricette.forEach(ricetta => {
        let ingredientiInComune = 0;
        ricetta.ingredienti.forEach(ingrediente => {
            if (ingredientiUtente.includes(ingrediente)) {
                ingredientiInComune++;
            }
        });

        const percentuale = Math.round(
            (ingredientiInComune / ricetta.ingredienti.length) * 100
        );

        if (ingredientiInComune > 0) {
            ricetteTrovate.push({
                nome: ricetta.nome,
                percentuale: percentuale,
                mancanti: ricetta.ingredienti.filter(
                    i => !ingredientiUtente.includes(i)
                )
            });
        }
    });


    // Step 2d: Mostrare i risultati
    ricetteTrovate.sort((a, b) => b.percentuale - a.percentuale);

    ricetteTrovate.forEach(r => {
        const li = document.createElement("li");

        // ✅ Qui inseriamo la colorazione percentuale
        let colore;
        if (r.percentuale >= 80) colore = "#38a169"; // verde
        else if (r.percentuale >= 50) colore = "#d69e2e"; // giallo/arancio
        else colore = "#e53e3e"; // rosso

        // ✅ Qui possiamo trasformare <li> in card
        li.className = "recipe-card";
        li.innerHTML = `
            <strong style="color:${colore}">${r.nome}</strong><br>
            Compatibilità: ${r.percentuale}%<br>
            Ingredienti mancanti: ${r.mancanti.join(", ")}
        `;

        risultati.appendChild(li);
    });

    if (ricetteTrovate.length === 0) {
        risultati.innerHTML = "<li>Nessuna ricetta trovata 😢</li>";
    }
}



// 3️⃣ Funzioni aggiuntive (UX)
function svuota() {
    document.getElementById("ingredientiInput").value = "";
    document.getElementById("risultati").innerHTML = "";
    document.getElementById("messaggio").textContent = "Lista svuotata ✅";
}

async function cercaRicetteOnline() {
    const input = document.getElementById("ingredientiInput").value;
    const ingrediente = input.split(",")[0].trim();

    const risultati = document.getElementById("risultati");
    risultati.innerHTML = "<li>Caricamento...</li>";

    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`
    );

    const data = await response.json();

    risultati.innerHTML = "";

    if (!data.meals) {
        risultati.innerHTML = "<li>Nessuna ricetta trovata online 😢</li>";
        return;
    }

    data.meals.slice(0, 5).forEach(meal => {
        const li = document.createElement("li");
        li.textContent = meal.strMeal;
        risultati.appendChild(li);
    });
}

