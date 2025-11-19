// Comprehensive list of major UK train stations with CRS codes.
// This list covers major cities, London terminals, and key commuter routes.
// Source: Fetched from stations.json

let stationData = [];

// Function to load and process station data
async function loadStationData() {
    try {
        const response = await fetch('stations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
        
        // Map the raw JSON data to the format required by the autocomplete logic
        stationData = rawData.map(station => ({
            name: station.stationName,
            code: station.crsCode
        }));
        
        console.log(`Loaded ${stationData.length} stations.`);
    } catch (error) {
        console.error("Failed to load station data:", error);
        // Fallback data in case fetch fails (optional, but good for resilience)
        stationData = [
            { name: "London Paddington", code: "PAD" },
            { name: "Didcot Parkway", code: "DID" }
        ];
    }
}

// Initialize data load immediately
loadStationData();