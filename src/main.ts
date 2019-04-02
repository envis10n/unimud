import Commands from "@modules/commands";

// Main function (entry point)
async function main() {
    await Commands.reload();
    console.log(Commands.cache);
    const { WSS } = (await import("@modules/network"));
}

// Start main.
main();
