# Node.js as base for build
FROM node:lts-alpine as build
WORKDIR /usr/GDSC-FSC/gdsc-bot

# Install dependencies & build
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Node.js as base for run
FROM node:lts-alpine
WORKDIR /usr/GDSC-FSC/gdsc-bot

# Copy files from build
COPY --from=build /usr/GDSC-FSC/gdsc-bot/node_modules /usr/GDSC-FSC/gdsc-bot/node_modules
COPY --from=build /usr/GDSC-FSC/gdsc-bot/scripts /usr/GDSC-FSC/gdsc-bot/scripts
COPY --from=build ["/usr/GDSC-FSC/gdsc-bot/commands.json", "/usr/GDSC-FSC/gdsc-bot/dist", "/usr/GDSC-FSC/gdsc-bot/package.json", "/usr/GDSC-FSC/gdsc-bot/"]

# Expose port for web server
EXPOSE 3000

# Run the bot
CMD ["node", "index.js"]