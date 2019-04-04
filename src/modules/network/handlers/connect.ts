import { WClient } from "../ws";
import _handlers from ".";
import auth from "@modules/auth";

async function authLoop(client: WClient) {
    const username = await client.ask("Username: ");
    if (await auth.accountExists(username)) {
        // Exists. Get password.
        const password = await client.ask("Password: ", true);
        const account = await auth.authAccount(username, password);
        if (account !== null) {
            client.account = account.uuid;
            client.send("Authenticated.");
        } else {
            client.send("[Error] Authentication failed.");
            authLoop(client);
        }
    } else {
        // Ask for register.
        if (await client.yesNo("Would you like to register this username?")) {
            const password = await client.ask("Password: ", true);
            const passwordRe = await client.ask("Re-type Password: ", true);
            if (password === passwordRe) {
                const account = await auth.createAccount(username, password);
                if (account !== null) {
                    client.account = account.uuid;
                    client.send("Registration successful.\nAuthenticated.");
                }
            } else {
                client.send("[Error] Passwords did not match.");
                authLoop(client);
            }
        } else {
            client.send("Registration cancelled.");
            authLoop(client);
        }
    }
}

export default async function(client: WClient) {
    authLoop(client);
    client.on("close", async (code, reason) => {
        if (client.account !== null) {
            await auth.logoutAccount(client.account);
        }
    });
}
