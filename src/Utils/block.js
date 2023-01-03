const fs = require('fs');

async function getBlockedUsersJson(user, commands) {
    // Check if the file exists
    let blockedUsers
    if (fs.existsSync('./src/blockedUser.json')) {
        // Read the json
        const json = fs.readFileSync('./src/blockedUser.json', 'utf8');
        // Parse the json
        blockedUsers = JSON.parse(json);
    } else {
        // Create the json
        blockedUsers = { [user]: [commands] };
    }
    // Check if the user is blocked
    if (blockedUsers[user] && blockedUsers[user].includes(commands)) {
        // return as null (false)
        return null;
    } else {
        // Check if user is in the json
        if (blockedUsers[user]) {
            // Add the command to the array
            blockedUsers[user].push(commands);
        } else {
            // Create the user and add the command
            blockedUsers[user] = [commands];
        }
        // Write the json
        fs.writeFileSync('./src/blockedUser.json', JSON.stringify(blockedUsers, null, 4));
        // return as true (success)
        return true;
    }
}

module.exports = { getBlockedUsersJson };