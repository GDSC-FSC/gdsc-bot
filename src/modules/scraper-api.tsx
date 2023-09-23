import express from 'express';
import axios from 'axios';
import {load} from 'cheerio';
import db from '../utils/database';
import {client} from '..';
import {EventsModule} from './latestevents';

const app = express();
const PORT = 3000;

type Event = {
    title: string | null;
    thumbnailLink: string | null;
    detailsLink: string | null;
    date: string | null;
    activityType: string | null;
    description: string | null;
};


const scrapeEvents = async (): Promise<Event[]> => {
    const response = await axios.get('https://gdsc.community.dev/farmingdale-state-college/');
    const html = response.data;
    const $ = load(html);

    const events: Event[] = [];

    $('div.panel-body.clearfix').each((i, elem) => {
        const title = $(elem).find('h4.general-body--color').text();
        const thumbnailLink = $(elem).find('a.picture').attr('href') || null;
        const detailsLink = $(elem).find('.btn.btn-primary.purchase-ticket').attr('href') || null;
        const date = $(elem).find('div.date.general-body--color strong').text();
        const activityType = $(elem).find('div.date.general-body--color span').text();
        const description = $(elem).find('p.description.general-body--color').text();

        events.push({
            title,
            thumbnailLink,
            detailsLink,
            date,
            activityType,
            description
        });
    });

    return events;
};

interface EventCountResult {
    count: number;
}

// this has code to avoid duplicates
const saveEventsToDB = (events: Event[]) => {
    const selectStmt = db.prepare('SELECT COUNT(*) as count FROM events WHERE title = ? AND date = ?');
    const insertStmt = db.prepare('INSERT INTO events (title, thumbnailLink, detailsLink, date, activityType, description) VALUES (?, ?, ?, ?, ?, ?)');

    for (const event of events) {
        const existingEventCount = (selectStmt.get(event.title, event.date) as EventCountResult).count;
        if (existingEventCount > 0) {
            console.log(`Error: Duplicate event found (title: ${event.title}, date: ${event.date})... ignoring`);
            continue;
        }

        insertStmt.run(event.title, event.thumbnailLink, event.detailsLink, event.date, event.activityType, event.description);
    }
};

// This does Not have code to avoid duplicates

/*
const saveEventsToDB = (events: Event[]) => {
    const insertStmt = db.prepare('INSERT INTO events (title, thumbnailLink, detailsLink, date, activityType, description) VALUES (?, ?, ?, ?, ?, ?)');

    for (const event of events) {
        insertStmt.run(event.title, event.thumbnailLink, event.detailsLink, event.date, event.activityType, event.description);
    }
};
*/

app.get('/events', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log('Requested events');
    try {
        const events = db.prepare('SELECT * FROM events').all();
        res.json(events);
    } catch (error) {
        console.error('An error occurred reading the events from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

setInterval(async () => {
    console.log('Weekly scrape started...');
    const eventsBeforeScrape = db.prepare('SELECT * FROM events').all();
    const events = await scrapeEvents();
    saveEventsToDB(events);
    console.log('Weekly scrape complete!');

    const eventsAfterScrape = db.prepare('SELECT * FROM events').all();
    if(eventsAfterScrape.length > eventsBeforeScrape.length) {
        await EventsModule.notifyLatestEvent(client);
    }
}, 7 * 24 * 60 * 60 * 1000);

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}/events`);

    console.log('Initial scrape started...');
    const eventsBeforeScrape = db.prepare('SELECT * FROM events').all();
    const initialEvents = await scrapeEvents();
    saveEventsToDB(initialEvents);
    console.log('Initial scrape complete!');

    const eventsAfterScrape = db.prepare('SELECT * FROM events').all();
    if(eventsAfterScrape.length > eventsBeforeScrape.length) {
        await EventsModule.notifyLatestEvent(client);
    }
});

