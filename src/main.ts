// Main function (entry point)
async function main() {
    const { wss } = await import("@modules/network");
    wss.on("listening", (port) => {
        console.log("WebSocket listening on port", port);
    });
}

// Start main.
main();
