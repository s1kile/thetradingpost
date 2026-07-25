async function fetchInventoryFromSheet() {
    const timestamp = Date.now();
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhqrHO8KhYKnzNFhkqd5ZdxqonhHvviI1jF9TR3rja1s8sWlzj9hGRPwMO9o_RKTRNEiRYG-Hw-MVz/pub?gid=566053171&single=true&output=csv" + timestamp;

    const response = await fetch(sheetUrl);

    if (!response.ok) {
        throw new Error(`Inventory fetch failed with status ${response.status}`);
    }

    return response.text();
}

async function inventoryApiHandler(req, res) {
    try {
        const rawText = await fetchInventoryFromSheet();

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.status(200).send(rawText);
    } catch (error) {
        console.error("Inventory API error:", error);
        res.status(502).send("Unable to load inventory");
    }
}

module.exports = {
    fetchInventoryFromSheet,
    inventoryApiHandler
};
