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
    <div class="recipe-header">
        <span class="recipe-icon">🍽️</span>
        <strong style="color:${colore}">${r.nome}</strong>
    </div>
    <div class="recipe-body">
        <div>Fattibilità: ${r.percentuale}%</div>
        <div class="missing">
            Ingredienti mancanti: ${r.mancanti.length ? r.mancanti.join(", ") : "Nessuno 🎉"}
        </div>
    </div>
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
