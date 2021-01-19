---
title: "Creating a Node.js server/client with Socket.IO & MySQL"
date: "2013-11-07T10:08:00.000Z"
tags: ["mysql", "nodejs", "socketio"]
---

Personally, I find Node.js to be completely fascinating. It's a direct lineage of <a href="http://www.codinghorror.com/blog/2007/07/the-principle-of-least-power.html" target="_blank">Atwood's Law</a>, that "any application that can be written in JavaScript, will eventually be written in JavaScript". Even the server. This, my friends, in a day of jQuery and JSON starting to rule the world, is a beautiful thing.

A real nice Node community is forming (and for that matter, has already formed), and tutorials are starting to pop up on the internet of how to write a server/client with Node. I'd like to give you my take on that, starting with a MySQL-supported writeup for all those other LAMP guys out there wanting to start to dabble in Node, and even more specifically it's websockets implementation, Socket.IO.

## Get the Required NPM's

Node works with it's own repository of packages called npm (node package manager), sort of like Ubuntu's apt repository. Let's go ahead and install our required packages for the server, and use homebrew to install node:

```bash
brew install node
npm install socket.io mysql
```

## Create the Node.js Server

Some tuts start on creating a client first, but I like to start with the server so that there aren't broken commands running at any given time.

We'll start by creating our MySQL database. This tutorial assumes that you have a 'root' username with no password set.

```bash
mysql -u root -e 'CREATE DATABASE node'
```

Then we'll populate it with some data. This should just be considered the base data that we'll start with (instead of having no records):

```bash
mysql -u root node -e 'CREATE TABLE notes (id INT(8) NOT NULL AUTO_INCREMENT, note VARCHAR(50) NOT NULL, PRIMARY KEY (id))'
mysql -u root node -e 'INSERT INTO notes (note) VALUES ("This is a test!", "This is another test...", "And, yet again, another...")'
```

Let's now go ahead and create a folder to house all of our files:

```bash
mkdir node
cd node
```

Now we want to create our `server.js` file and put in our backend code to run the server. Check out the comments for some basic understanding of what's going on; it's all really pretty simple.

<div class="gatsby-code-title">server.js</div>

```js
var mysql = require('mysql')
// Let’s make node/socketio listen on port 3000
var io = require('socket.io').listen(3000)
// Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node'
})
 
// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})
 
// Define/initialize our global vars
var notes = []
var isInitNotes = false
var socketCount = 0
 
io.sockets.on('connection', function(socket){
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)
 
    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })
 
    socket.on('new note', function(data){
        // New note added, push to all sockets and insert into db
        notes.push(data)
        io.sockets.emit('new note', data)
        // Use node's db injection format to filter incoming data
        db.query('INSERT INTO notes (note) VALUES (?)', data.note)
    })
 
    // Check to see if initial query/notes are set
    if (! isInitNotes) {
        // Initial app start, run db query
        db.query('SELECT * FROM notes')
            .on('result', function(data){
                // Push results onto the notes array
                notes.push(data)
            })
            .on('end', function(){
                // Only emit notes after query has been completed
                socket.emit('initial notes', notes)
            })
 
        isInitNotes = true
    } else {
        // Initial notes already exist, send out
        socket.emit('initial notes', notes)
    }
})
```

At this point you can run your node server:

```bash
node server.js
```

and you should see the message output in terminal, `info - socket.io started`. You can use Ctrl+C to stop the server at any time.

## Setup the Client File

My guess is that you want some sort of web browser interaction with this server (why you are on this page, eh?), so let's create the client-side file to connect to this socket.

Call me lazy or just biased, but I don't even think to begin any JavaScript app without jQuery. We'll use the Google-CDN hosted jQuery file, and the socket.io.js file is automatically loaded from your running node server.

Create a client-side html file which will load jQuery, socket.io, as well as our client-side code. We'll name this index.html.

<div class="gatsby-code-title">index.html</div>

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<script>
$(document).ready(function(){
    // Connect to our node/websockets server
    var socket = io.connect('http://localhost:3000');
 
    // Initial set of notes, loop through and add to list
    socket.on('initial notes', function(data){
        var html = ''
        for (var i = 0; i < data.length; i++){
            // We store html as a var then add to DOM after for efficiency
            html += '<li>' + data[i].note + '</li>'
        }
        $('#notes').html(html)
    })
 
    // New note emitted, add it to our list of current notes
    socket.on('new note', function(data){
        $('#notes').append('<li>' + data.note + '</li>')
    })
 
    // New socket connected, display new count on page
    socket.on('users connected', function(data){
        $('#usersConnected').html('Users connected: ' + data)
    })
 
    // Add a new (random) note, emit to server to let others know
    $('#newNote').click(function(){
        var newNote = 'This is a random ' + (Math.floor(Math.random() * 100) + 1)  + ' note'
        socket.emit('new note', {note: newNote})
    })
})
</script>
<ul id="notes"></ul>
<div id="usersConnected"></div>
<div id="newNote">Create a new note</div>
```

Open the `index.html` file in a web browser, and you should now see our MySQL database records! Bam! I didn't go too much into detail in this article about what the file does, but the documentation speaks for itself. Read, analyze, code and understand :)

You'll see something like the following in your node server logs in your terminal window:

```bash
   debug - served static content /socket.io.js
   debug - client authorized
   info  - handshake authorized 8yYA5wvw2ItTPZ2GHoUD
   debug - setting request GET /socket.io/1/websocket/8yYA5wvw2ItTPZ2GHoUD
   debug - set heartbeat interval for client 8yYA5wvw2ItTPZ2GHoUD
   debug - client authorized for 
   debug - websocket writing 1::
   debug - websocket writing 5:::{"name":"users connected","args":[1]}
   debug - websocket writing 5:::{"name":"initial notes","args":[[{"id":1,"note":"This is a test!"},{"id":2,"note":"This is another test..."},{"id":3,"note":"And, yet again, another..."}]]
```

Node's really nice verbose logging really tells you everything that is going on.

## Test with Multiple Browser Windows

You can now open up index.html in multiple browser windows. Every new window should connect a new socket, thus incrementating the "Users connected" part of the screen... in *each* browser window, instantaneously. Add a new note in one browser window, adds it to all other browser windows (each a socket), instantly.

```bash
    debug - websocket writing 5:::{"name":"new note","args":[{"note":"This is a random 59 note"}]}
```

Appreicate the magic of node.js. Hopefully this helps demystify some of the misunderstandings of node and really gives you a brief understanding of how Node.js, Socket.IO and MySQL can be setup to provide near-instantanenous bidirectional communication.
