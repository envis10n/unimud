import Commands from "../";

const command: Commands.ICommand  = {
    permissions: [],
    options: [],
    handler: async (client, args) => {
        const msg = await client.ask(`What is your favorite color? `);
        client.send("You said " + msg);
    },
};

export = command;
