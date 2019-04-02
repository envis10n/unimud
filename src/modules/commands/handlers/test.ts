import Commands from "../";

const command: Commands.ICommand  = {
    permissions: [],
    options: [],
    handler: async (client, args) => {
        client.send("Test OK");
    },
};

export = command;
