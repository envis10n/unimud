import Commands from "@modules/commands";

// Main function (entry point)
async function main() {
    // Load DB.
    const db = await import("@db");
    // Reload commands.
    await Commands.reload();
    // Start WebSocket server.
    await import("@modules/network");
    // Start web server thread.
    await import("@modules/web");
}

// Start main.
main();
