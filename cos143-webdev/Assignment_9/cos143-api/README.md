# COS 143 User API

[Demo of API Usage](https://stormy-thicket-73472.herokuapp.com/)

### Installation on MacOS/Linux

Below is for MacOS/Linux. Windows users, let me know how you like to install Node and I'll update it.


#### Install NodeJS
```console
# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

# Activate it 
. ~/.nvm/nvm.sh

# Many versions will work after version 8. Using version 10.15.1 (lts/dubnium)
nvm install v10.15.1

# Verify node is installed
node -e "console.log('Running Node.js ' + process.version)"

# Should say Running Node.js v10.15.1
```

#### Install project dependencies
```console
cd cos143-api
npm install
```

### Running
Data stored is in-memory. Data is erased each time the server restarts.
```console
cd cos143-api
node app.js

# Open your browser at http://localhost:3000
# Hit the api like  http://localhost:3000/api/users
```

### Running on a custom port
```console
PORT=8080 node app.js
```