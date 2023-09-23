import { EmbedData } from 'discord.js';
import db from '../utils/database'; // Adjust the import path according to your project structure

export interface Config {
    autoResponder: {
        includes: string[];
        message?: string;
        embed?: EmbedData;
    }[];
}

interface AutoResponderRow {
    trigger_phrase: string;
    response_message: string;
    embed_data: string;
}

const defaultConfig: Config = { autoResponder: [] };
let loaded: Config | null = null;

export function saveConfig(config: Config) {
    const query = `
        INSERT INTO config (id, data)
        VALUES (1, ?)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data;
    `;

    db.prepare(query).run(JSON.stringify(config));
}


export function loadConfigFromDB(): Config {
    const query = `SELECT trigger_phrase, response_message, embed_data
                   FROM autoresponders;`;
    const result: AutoResponderRow[] = (db.prepare(query).all() as AutoResponderRow[]);

    const autoResponderRules = result.map((row: AutoResponderRow) => ({
        includes: [row.trigger_phrase],
        message: row.response_message,
        embed: row.embed_data ? JSON.parse(row.embed_data) : undefined,
    }));

    loaded = { autoResponder: autoResponderRules };
    return loaded;
}


export function getConfig(): Config {
    if (loaded) {
        return loaded;
    }
    return loadConfigFromDB();
}

export function addAutoResponder(
    triggerPhrase: string,
    responseMessage?: string,
    embedData?: EmbedData
) {
    const query = `
        INSERT INTO autoresponders (trigger_phrase, response_message, embed_data)
        VALUES (?, ?, ?);
    `;

    db.prepare(query).run(
        triggerPhrase,
        responseMessage,
        embedData ? JSON.stringify(embedData) : null
    );

    loaded = null;
}

export function removeAutoResponder(triggerPhrase: string) {
    const query = `
        DELETE
        FROM autoresponders
        WHERE trigger_phrase = ?;
    `;

    db.prepare(query).run(triggerPhrase);
    loaded = null;
}

export function reloadConfig(): Config {
    loaded = null;
    return getConfig();
}
