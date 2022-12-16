# discordBot

Bot for private channels on Discord, not for public use.

## Requirements

-   [Node.js](https://nodejs.org/en/) (v12.0.0 or newer)
-   [Discord.js](https://discord.js.org/#/) (v14.7.1 or newer)
-   [MongoDB](https://www.mongodb.com/) (v4.2.0 or newer)

## Support Architecture

-   AMD64
-   ARM64

## Installation

1.  Clone the repository
2.  Install the dependencies with `npm install`

## Configuration

1.  Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
2.  Create a new bot user and copy the token
3.  Copy the `config.example.json` file to `config.json` and fill in the required fields
4.  Invite the bot to your server with the following link: `https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=8` (replace `CLIENT_ID` with your client ID)
5.  Copy Application ID from the General Information page and paste it into the `config.json` file
6.  Copy your Discord ID and paste it into the `config.json` file
7.  Copy your Webhook URL and paste it into the `config.json` file
8.  Start the bot with `npm run start`

# Tested on

-   Ubuntu 20.04.2 LTS
-   Android (Termux)
