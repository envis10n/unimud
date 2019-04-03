import Commands from "../";
import db from "@db";

const command: Commands.ICommand  = {
    permissions: [],
    options: [],
    handler: async (client, args) => {
        const colors = db.collection("colors");
        const last = colors.findOne({_key: client.uuid});
        let c: string = "None";
        if (last !== null) {
            c = last.color;
        }
        const msg = await client.ask(`What is your favorite color? (Last: ${c}): `);
        client.send("You said " + msg);
        if (last !== null) {
            colors.updateOne(last._key, {color: msg});
        } else {
            colors.insert({
                _key: client.uuid,
                color: msg,
            });
        }
    },
};

export = command;
