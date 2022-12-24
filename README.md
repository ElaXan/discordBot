# discordBot

Bot for private channels on Discord, not for public use.

![Licenses](https://img.shields.io/github/license/ElaXan/discordBot) ![Version](https://img.shields.io/github/package-json/v/ElaXan/discordBot) ![Last Commit](https://img.shields.io/github/last-commit/ElaXan/discordBot) ![Code Size](https://img.shields.io/github/languages/code-size/ElaXan/discordBot) ![Repo Size](https://img.shields.io/github/repo-size/ElaXan/discordBot) ![Files Total](https://img.shields.io/github/directory-file-count/ElaXan/discordBot) ![Files Code](https://img.shields.io/github/languages/count/ElaXan/discordBot)

## Requirements

-   [Node.js](https://nodejs.org/en/) (v16.6.0 or newer)
-   [Discord.js](https://discord.js.org/#/) (v14.7.1 or newer)

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

# Fill in the required fields

## How do I get the bot token?

To get the TOKEN for a Discord bot in Discord.js, follow these steps:

1.   Create a Discord developer account and create a new application. To do this, go to the Discord Developer Portal (https://discord.com/developers/applications) and click the "New Application" button.
2.   Give your application a name and click the "Create" button.
3.   On the dashboard, click the "Create a Bot" button.
4.   Click the "Copy" button to copy the TOKEN to your clipboard.
5.   Paste the TOKEN to `config.json` file.

## How do I get the client ID?

To get the Application ID for a Discord.js application that you have already created, follow these steps:

1.   Go to the Discord Developer Portal (https://discord.com/developers/applications) and sign in with your Discord developer account.
2.   On the dashboard, click on the application for which you want to get the Application ID.
3.   The Application ID for your application will be displayed on the page. You can find it under the "General Information" tab, next to the "Client ID" label. Copy the Application ID.
4.   Paste the Application ID to `config.json` file.

## How do I get the guild ID?

To get the GUILD ID for a Discord server in Discord.js, follow these steps:

1.   Go to the Discord server for which you want to get the GUILD ID.
2.   Right-click on the server name and select "Copy ID" from the context menu. This will copy the GUILD ID to your clipboard.
3.   Paste the GUILD ID to `config.json` file.

## How do I get the Webhook URL?

To get the Webhook URL for a Discord server, follow these steps:

1.   Go to the "Server Settings" for the server you want to create the webhook for, and click the "Webhooks" tab.
2.   Click the "Create Webhook" button, give your webhook a name and choose the channel you want the webhook to post to. Then click the "Create" button.
3.   The Webhook URL will be displayed on the page. Copy this URL and use it in conjunction with the `config.json` file.

## How do I get the Owner ID?

To get the Owner ID for a Discord application in Discord.js using your Discord account ID, follow these steps:

1.   Go to your Discord account settings and click the "Appearance" tab.
2.   Enable the "Developer Mode" option by clicking the toggle next to it.
3.   Go to the Discord server where you are the owner of the application, and right-click on your username in the member list.
4.   Select "Copy ID" from the context menu. This will copy your Discord account ID to your clipboard.
5.   Paste the Discord account ID to `config.json` file.