export async function fetchJson<T = any>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        // Parse du JSON
        const data = (await res.json()) as T;
        return data;
    } catch (err) {
        console.error(`❌ Erreur lors du fetch JSON (${url}):`, err);
        return null;
    }
}