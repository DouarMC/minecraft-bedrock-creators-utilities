export async function fetchAnimals(): Promise<string[]> {
    const url = "https://raw.githubusercontent.com/DouarMC/minecraft-bedrock-creators-utilities/refs/heads/master/webdata/test/animal.ts";

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const animals = (await res.json()) as string[];
        console.log("✅ Liste récupérée depuis GitHub:", animals);
        return animals;
    } catch (err) {
        console.error("❌ Impossible de récupérer la liste d'animaux :", err);
        return [];
    }
}

// Auto-exécution pour un script npm
(async () => {
    const animals = await fetchAnimals();
    console.log("Animaux:", animals.join(", "));
})();