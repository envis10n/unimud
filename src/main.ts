import Commands from "@modules/commands";

// Main function (entry point)
async function main() {
    // Reload commands.
    await Commands.reload();
    // Start WebSocket server.
    const { WSS } = (await import("@modules/network"));
    // Start web server thread.
    await import("@modules/web");
}

// Start main.
main();
