const express=require('express');

const port=8080;
const { engine }=require('express-handlebars');



const app = express();

// HANDLEBARS
app.engine('handlebars', engine({
    helpers: {
        eq(a, b) { return a == b; }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/', function (req, res) {
    res.render('home.handlebars');
});

app.use(express.static('public'));


// Projects data (JSON variable)
const projects = [
    {
        id: 1,
        name: "Digital Portrait Series", 
        type: "Teaching",
        year: 2023,
        desc: "Interactive digital art workshop teaching portrait composition and digital painting techniques",
        image: "digital-portraits.jpg",
        url: "https://github.com/example/digital-portraits"
    },
    {
        id: 2,
        name: "AI-Generated Art Research", 
        type: "Research",
        year: 2023,
        desc: "Exploring the intersection of artificial intelligence and creative expression through generative art",
        image: "ai-art-research.jpg",
        url: "https://github.com/example/ai-art-research"
    },
    {
        id: 3,
        name: "Abstract Watercolor Workshop",
        type: "Teaching",
        year: 2022,
        desc: "Hands-on workshop exploring fluid watercolor techniques and abstract composition principles",
        image: "watercolor-workshop.jpg",
        url: "https://github.com/example/watercolor-workshop"
    },
    {
        id: 4,
        name: "Color Theory in Digital Media",
        type: "Research",
        year: 2022,
        desc: "Research study on color perception and emotional response in digital art installations", 
        image: "color-theory-study.jpg",
        url: "https://github.com/example/color-theory-study"
    },
    {
        id: 5,
        name: "Sculpture Fundamentals Course", 
        type: "Teaching",
        year: 2024,
        desc: "Comprehensive course covering clay modeling, stone carving, and metal sculpting techniques",
        image: "sculpture-course.jpg",
        url: "https://github.com/example/sculpture-course"
    },
    {
        id: 6,
        name: "Mixed Media Installation Study", 
        type: "Research",
        year: 2024,
        desc: "Investigation of audience interaction with multimedia art installations in gallery spaces", 
        image: "mixed-media-installation.jpg",
        url: "https://github.com/example/mixed-media-installation"
    }
];

// Routes
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'Welcome to My Portfolio',
        message: 'Hello! Welcome to my personal website.' 
    });
});


app.get('/about', function (req, res) {
    res.render('cvjl.handlebars');
});


app.get('/contact', function (req, res) {
    res.render('contact.handlebars');
});

app.get('/game', function(req, res){
    res.sendFile('/Users/Admin/Desktop/unicoding/project-WebDevFun-2024/views/index.html')
});






const sqlite3 = require('sqlite3'); // load the sqlite3 package
const fs = require('fs');

// --- DATABASE ---
const dbFile = 'my-project-data.sqlite3.db'; // Define your database file name
let db = new sqlite3.Database(dbFile); // Initialize the database

// --- MIDDLEWARES ---

// middleware to search for unknown routes into the 'public' directory
app.use(express.static('public')); // the public directory is static

// using express middleware for processing forms sent using the "post" method
app.use(express.urlencoded({ extended: true }));

function initTableSkills(mydb) {
    // MODEL for skills
    const skills = [
        { "id": 1, "name": "PHP", "type": "Programming language", "desc": "Programming with PHP on the server side.", "level": 4 },
        { "id": 2, "name": "Python", "type": "Programming language", "desc": "Programming with Python.", "level": 4 },
        { "id": 3, "name": "Java", "type": "Programming language", "desc": "Programming with Java.", "level": 2 },
        { "id": 4, "name": "ImageJ", "type": "Framework", "desc": "Java Framework for Image Processing.", "level": 2 },
        { "id": 5, "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side.", "level": 4 },
        { "id": 6, "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side.", "level": 4 },
        { "id": 7, "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side.", "level": 4 },
        { "id": 8, "name": "Scikit-image", "type": "Library", "desc": "A Library for Image Processing with Python.", "level": 3 },
        { "id": 9, "name": "OpenCV", "type": "Library", "desc": "A library for Image Processing with Python.", "level": 4 },
        { "id": 10, "name": "LaTeX", "type": "Description language", "desc": "A language to describe and build professional documents.", "level": 5 },
        { "id": 11, "name": "HTML", "type": "Description language", "desc": "A language to create web pages.", "level": 4 },
        { "id": 12, "name": "CSS", "type": "Description language", "desc": "A language to apply styles to web pages.", "level": 4 },
        { "id": 13, "name": "C", "type": "Programming language", "desc": "The historical language of the Linux/Unix kernels.", "level": 3 },
        { "id": 14, "name": "C++", "type": "Programming language", "desc": "A fast high level programming language.", "level": 1 },
        { "id": 15, "name": "SQL", "type": "Query language", "desc": "The relational database language to access data (CRUD).", "level": 4 }
    ];

    // create table skills at startup
    mydb.run("CREATE TABLE skills (sid INTEGER PRIMARY KEY AUTOINCREMENT, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL, slevel INT)", (error) => {
        if (error) {
            console.log("ERROR:", error); // error: display it in the terminal
        } else {
            console.log("Table skills created!"); // no error, the table has been created

            // inserts skills
            skills.forEach((oneSkill) => {
                mydb.run("INSERT INTO skills (sid, sname, sdesc, stype, slevel) VALUES (?, ?, ?, ?, ?)",
                    [oneSkill.id, oneSkill.name, oneSkill.desc, oneSkill.type, oneSkill.level], (error) => {
                        if (error) {
                            console.log("ERROR inserting skill:", error);
                        } else {
                            console.log("Line added into the skills table!");
                        }
                    });
            });
        }
    });
}

// initTableProjects creates the 'projects' table and populates it
function initTableProjects(mydb) {
    // MODEL for projects
    // Using the projects data from our previous conversation, with 'name' and 'desc'
    const projects = [
        {
            id: 1,
            name: "Digital Portrait Series",
            type: "Teaching",
            year: 2023,
            desc: "Interactive digital art workshop teaching portrait composition and digital painting techniques",
            image: "digital-portraits.jpg",
            url: "https://github.com/example/digital-portraits"
        },
        {
            id: 2,
            name: "AI-Generated Art Research",
            type: "Research",
            year: 2023,
            desc: "Exploring the intersection of artificial intelligence and creative expression through generative art",
            image: "ai-art-research.jpg",
            url: "https://github.com/example/ai-art-research"
        },
        {
            id: 3,
            name: "Abstract Watercolor Workshop",
            type: "Teaching",
            year: 2022,
            desc: "Hands-on workshop exploring fluid watercolor techniques and abstract composition principles",
            image: "watercolor-workshop.jpg",
            url: "https://github.com/example/watercolor-workshop"
        },
        {
            id: 4,
            name: "Color Theory in Digital Media",
            type: "Research",
            year: 2022,
            desc: "Research study on color perception and emotional response in digital art installations",
            image: "color-theory-study.jpg",
            url: "https://github.com/example/color-theory-study"
        },
        {
            id: 5,
            name: "Sculpture Fundamentals Course",
            type: "Teaching",
            year: 2024,
            desc: "Comprehensive course covering clay modeling, stone carving, and metal sculpting techniques",
            image: "sculpture-course.jpg",
            url: "https://github.com/example/sculpture-course"
        },
        {
            id: 6,
            name: "Mixed Media Installation Study",
            type: "Research",
            year: 2024,
            desc: "Investigation of audience interaction with multimedia art installations in gallery spaces",
            image: "mixed-media-installation.jpg",
            url: "https://github.com/example/mixed-media-installation"
        }
    ];

    // create table projects at startup
    mydb.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY AUTOINCREMENT, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => {
        if (error) {
            console.log("ERROR:", error); // error: display it in the terminal
        } else {
            console.log("Table projects created!"); // no error, the table has been created

            // inserts projects
            projects.forEach((oneProject) => {
                mydb.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)",
                    [oneProject.id, oneProject.name, oneProject.year, oneProject.desc, oneProject.type, oneProject.image], (error) => { // NOTE: pimgURL expects the image filename
                        if (error) {
                            console.log("ERROR inserting project:", error);
                        } else {
                            console.log("Line added into the projects table!");
                        }
                    });
            });
        }
    });
}




// --- ROUTES ---

// create a new route to send back the skills page
app.get('/skills', function (req, res) {
    db.all("SELECT * FROM skills", (error, listOfSkills) => {
        if (error) {
            console.log("ERROR fetching skills:", error); // error: display in terminal
            res.status(500).send("Error fetching skills."); // Send an error response to client
        } else {
            const model = { skills: listOfSkills };
            res.render('skills.handlebars', model);
        }
    });
});

// Update the /projects route to fetch data from the database
app.get('/projects', function (req, res) {
    db.all("SELECT pid, pname, pyear, pdesc, ptype, pimgURL FROM projects", (error, listOfProjects) => {
        if (error) {
            console.log("ERROR fetching projects:", error);
            res.status(500).send("Error fetching projects.");
        } else {
            // Map the database column names to the Handlebars variable names
            const projectsForHandlebars = listOfProjects.map(p => ({
                id: p.pid,
                name: p.pname,
                year: p.pyear,
                desc: p.pdesc,
                type: p.ptype,
                image: p.pimgURL // Assuming pimgURL stores the filename (e.g., "digital-portraits.jpg")
            }));
            const model = { projects: projectsForHandlebars };
            res.render('projects.handlebars', model);
        }
    });
});


app.get('/login', (req, res) => {
    res.render('login.handlebars');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // verification steps
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // For now, just send a response to test if data is received
    res.send(`Received: Username - ${username}, Password - ${password}`);
});

app.listen(port, function () { // listen to the port
    initTableSkills(db); // create the table skills and populate it
    initTableProjects(db); // create the table projects and populate it
    // displays a message in the terminal when the server is listening
    console.log(`Server is listening on port ${port}...`);
});