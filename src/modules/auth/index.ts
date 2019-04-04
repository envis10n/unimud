import bcrypt from "bcrypt";
import db from "@db";
import { v4 } from "uuid";

namespace Auth {
    export async function createAccount(username: string, password: string): Promise<Option<IAccount>> {
        const col = await db.collection("accounts");
        if ((await col.findOne({ username })) === null) {
            // Account not found.
            const uuid = v4();
            const hash = await bcrypt.hash(password, 14);
            const account: IAccount = {
                _key: uuid,
                uuid,
                username,
                hash,
                lastLogin: Date.now(),
                flags: [],
                online: true,
                gmLevel: 0,
            };
            await col.insert(account);
            console.log(`[Auth] Account created: ${username}`);
            return account;
        } else {
            return null;
        }
    }

    export async function logoutAccount(uuid: string): Promise<void> {
        const col = await db.collection("accounts");
        await col.updateOne(uuid, { online: false });
    }

    export async function accountExists(username: string): Promise<boolean> {
        const col = await db.collection("accounts");
        const account: Option<IAccount> = (await col.findOne({ username })) as Option<IAccount>;
        return account !== null;
    }

    export async function authAccount(username: string, password: string): Promise<Option<IAccount>> {
        const col = await db.collection("accounts");
        const account: IAccount = (await col.findOne({ username })) as IAccount;
        if (account !== null) {
            if (await bcrypt.compare(password, account.hash)) {
                // Valid login.
                account.lastLogin = Date.now();
                account.online = true;
                await col.updateOne(account._key, account);
                return account;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export = Auth;
