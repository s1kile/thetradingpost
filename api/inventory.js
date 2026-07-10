async function fetchInventoryFromSheet() {
    const timestamp = Date.now();
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1yZTUAi0RI9jyfHA_8PxdJhCGAix7roLe-0you8YGP2A/export?format=csv&t=" + timestamp;

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
