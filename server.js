// Setup empty JS object to act as endpoint for all routes
const projectData = {
    myList: []
};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
let port = 4022;

// Start up an instance of app
const app = express();



/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static("website"));

// Cors for cross origin allowance
app.use(cors());

// Routes
app.get("/weather", (req, res) => {
	res.json(projectData);
}).post("/weather", (req, res) => {
    
    const bodyData = req.body;
    projectData.myList.push(bodyData);
    res.json(projectData.myList);
});

// Setup Server
function serve() {
	console.log("App is listening on http://localhost:" + port);
}

app.listen(port, serve);
