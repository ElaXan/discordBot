# discordBot

Bot for private channels on Discord, not for public use.

![Licenses](https://img.shields.io/github/license/ElaXan/discordBot) ![Version](https://img.shields.io/github/package-json/v/ElaXan/discordBot) ![Last Commit](https://img.shields.io/github/last-commit/ElaXan/discordBot) ![Code Size](https://img.shields.io/github/languages/code-size/ElaXan/discordBot) ![Repo Size](https://img.shields.io/github/repo-size/ElaXan/discordBot) ![Files Total](https://img.shields.io/github/directory-file-count/ElaXan/discordBot) ![Files Code](https://img.shields.io/github/languages/count/ElaXan/discordBot)

## Requirements

-   [Node.js](https://nodejs.org/en/) (v16.6.0 or newer)
-   [Discord.js](https://discord.js.org/#/) (v14.7.1 or newer)
-   [MongoDB](https://www.mongodb.com/) (v4.2.0 or newer)

## Support Architecture

-   AMD64
-   ARM64

## Installation

1.  Clone the repository
2.  Install the dependencies with `npm i`

## Configuration

1.  Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
2.  Create a new bot user and copy the token
3.  Copy the `config-example.json` file to `config.json` and fill in the required fields
4.  Invite the bot to your server with the following link: `https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=8` (replace `CLIENT_ID` with your client ID)
5.  Register for slash commands with `npm run reg`
6.  Start the bot with `npm run start`

## Commands npm

-   `npm run start` - Start the bot
-   `npm run reg` - Register for slash commands
-   `npm run install` - Install the dependencies
-   `npm run uninstall` - Uninstall the dependencies
-   `npm run version` - Show the version of the bot

# Tested on

-   Ubuntu 20.04.5 LTS (amd64)
-   Ubuntu 22.04.1 LTS (arm64)
