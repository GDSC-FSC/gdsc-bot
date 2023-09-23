<div align="center">
    <a href="https://gdsc.community.dev/" target="_blank">
        <img src=".github/img.png" alt="Banner">
    </a>
    <br>
    <h2>GDSC Bot</h2>
    Official bot for GDSC 
</div>


## Features
- Get the latest event, title description and link
- List of most recent events
- List of all events that have ever happened, within a table format
- Notification system for events (wip)

## Prerequisites
Before you begin, ensure you have met the following requirements:

- Git: [Download](https://git-scm.com/downloads)
- Node.js: [Download](https://nodejs.org/)
- npm: [Download](https://www.npmjs.com/)

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/GDSC-FSC/gdsc-bot
```

2. Navigate to the directory:
```bash
cd gdsc-bot
```

3. Install the required dependencies:
```bash
npm install
```

4. Build and start the bot:
```bash
npm run build; npm run start
```

The bot's scraper will be available on `http://localhost:3000`.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgements

This project leverages the following libraries and tools:

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [axios](https://axios-http.com/docs/intro)
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) 
- [cheerio](https://cheerio.js.org/)
- [discord-api-types](https://www.npmjs.com/package/discord-api-types)
- [express](https://expressjs.com/)
- ... and many more listed in the project's [package.json](package.json) file.

## License
This project is licensed under the terms of the MIT license. For more details, see the [LICENSE](LICENSE) file in the repository.
