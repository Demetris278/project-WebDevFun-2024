const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const bcrypt = require('bcrypt'); // Load bcrypt
const session = require('express-session'); // sessions 
const connectSqlite3 = require('connect-sqlite3'); // store sessions in sQLite3 database

// --- DATABASE ---
const dbFile = 'my-project-data.sqlite3.db';
let db = new sqlite3.Database(dbFile);

// --- SESSIONS ---
const SQLiteStore = connectSqlite3(session); // Initialize SQLiteStore for sessions

app.use(session({ // definesession
    store: new SQLiteStore({ db: "session-db.db" }), 
    saveUninitialized: false, 
    resave: false,
    secret: "This123Is@Another#456GreatSecret678%Sentence"
}));

// This middleware makes session variables available to Handlebars templates via `session.propertyName`
app.use(function (req, res, next) {
    console.log("Session passed to response locals...")
    res.locals.session = req.session;
    next();
});

// --- GLOBAL DEFINITIONS ---
const adminName = 'jerome'; 
const adminPassword = '$2b$12$rW.1ZKQyXeTkwvy8xuGDQuI.Hi6Q61UFufRvIxM.DvFjVOmlbJl3S'; 

// salt rounds for bcrypt algorithm
const saltRounds = 12;

// --- Run this code ONLY ONCE! ---

// bcrypt.hash(adminPassword, saltRounds, function(err, hash) {
//     if (err) {
//         console.log("---> Error encrypting the password: ", err);
//     } else {
//         console.log("---> Hashed password (GENERATE only ONCE): ", hash);
//     }
// });


// --- USER FUNCTIONS ---

// initTableSkills creates the 'skills' table and populates it
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
            console.log("ERROR creating skills table:", error); // error: display it in the terminal
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
            console.log("ERROR creating projects table:", error); // error: display it in the terminal
        } else {
            console.log("Table projects created!"); // no error, the table has been created

            // inserts projects
            projects.forEach((oneProject) => {
                mydb.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)",
                    [oneProject.id, oneProject.name, oneProject.year, oneProject.desc, oneProject.type, oneProject.image], (error) => { 
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


// --- MIDDLEWARES ---

// middleware to search for unknown routes into the 'public' directory
app.use(express.static('public'));

// using express middleware for processing forms sent using the "post" method
app.use(express.urlencoded({ extended: true }));

// --- SESSIONS ---

app.use(session({ // define the session
    store: new SQLiteStore({ db: "session-db.db" }), 
    saveUninitialized: false, 
    resave: false, 
    secret: "This123Is@Another#456GreatSecret678%Sentence"
}));

//make session variables available to Handlebars templates via `session.propertyName`
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// --- HANDLEBARS ---
app.engine('handlebars', engine({
    helpers: {
        eq(a, b) { return a == b; }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


// --- ROUTES ---

// home route
app.get('/', function (req, res) {
    const model = {
        // isLoggedIn: req.session.isLoggedIn, // Not needed because we are using res.locals.session?
        // name: req.session.name,
        // isAdmin: req.session.isAdmin
    };
    console.log("---> Home model (session data via res.locals): " + JSON.stringify(req.session)); 
    res.render('home.handlebars', model);
});

//route to send back my CV
app.get('/about', function (req, res) {
    res.render('cvjl.handlebars');
});

// /contact route that will render the contact information.
app.get('/contact', function (req, res) {
    res.render('contact.handlebars');
});

// fetch skills data from the database
app.get('/skills', function (req, res) {
    db.all("SELECT * FROM skills", (error, listOfSkills) => {
        if (error) {
            console.log("ERROR fetching skills:", error);
            res.status(500).send("Error fetching skills.");
        } else {
            const model = { skills: listOfSkills };
            res.render('skills.handlebars', model);
        }
    });
});

// fetch projectdata from the database
app.get('/projects', function (req, res) {
    db.all("SELECT pid, pname, pyear, pdesc, ptype, pimgURL FROM projects", (error, listOfProjects) => {
        if (error) {
            console.log("ERROR fetching projects:", error);
        } else {
            // Map the database column names to the Handlebars variable names
            const projectsForHandlebars = listOfProjects.map(p => ({
                id: p.pid,
                name: p.pname,
                year: p.pyear,
                desc: p.pdesc,
                type: p.ptype,
                image: p.pimgURL
            }));
            const model = { projects: projectsForHandlebars };
            res.render('projects.handlebars', model);
        }
    });
});



// delete one project
app.get('/project/delete/:projid', function (req, res) {

    const projid = req.params.projid;
    console.log("Attempting to delete project ID:", projid);

    db.run("DELETE FROM projects WHERE pid=?", [projid], (error) => {
        if (error) {
            console.log("ERROR deleting project:", error);
            res.status(500).send("Error deleting project.");
        } else {
            console.log(`The project ${projid} has been deleted.`);
            res.redirect('/projects'); // Redirect back to the projects list
        }
    });
});

// i placed the code for the new project route (project/new) before anything using /project/{id}
// because not doing so treated "new" as a project id and led to a 404 error page
// create new project form
app.get('/project/new', function (req, res) {
    console.log("οςκαδοςδκαοςαδκπςαδκοπ");
    res.render('project-new.handlebars');
});

// submite new project
app.post('/project/new', function (req, res) {

    const name = req.body.projname;
    const year = req.body.projyear;
    const desc = req.body.projdesc;
    const type = req.body.projtype;
    const url = req.body.projurl; 

    db.run("INSERT INTO projects (pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)", [name, year, desc, type, url], (error) => {
        if (error) {
            console.log("ERROR inserting new project:", error);
            res.redirect('/projects');
        } else {
            console.log("Line added into the projects table!");
            res.redirect('/projects'); 
        }
    });
});

// Route for a single project ( /project/1, /project/2 etc.)
app.get('/project/:projectid', function (req, res) {
    const projectId = req.params.projectid;
    console.log("Project route parameter projectid:", projectId);

    db.get("SELECT pid, pname, pyear, pdesc, ptype, pimgURL FROM projects WHERE pid=?", [projectId], (error, theProject) => {
        if (error) {
            console.log("ERROR fetching single project:", error);
        }
        else {
            const model = { project: theProject };
            res.render('project.handlebars', model);
        }
    });
});

// pre-fill form for modifying an existing project
app.get('/project/modify/:projid', function (req, res) {

    const id = req.params.projid;
    db.get("SELECT pid, pname, pyear, pdesc, ptype, pimgURL FROM projects WHERE pid=?", [id], (error, theProject) => {
        if (error) {
            console.log("ERROR fetching project for modification:", error);
        } 
        else {
            const model = { project: theProject };
            res.render('project-new.handlebars', model); // Use the same form template for new/modify
        }
    });
});

// update existing project
app.post('/project/modify/:projid', function (req, res) {


    const id = req.params.projid;
    const name = req.body.projname;
    const year = req.body.projyear;
    const desc = req.body.projdesc;
    const type = req.body.projtype;
    const url = req.body.projurl;

    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", [name, year, desc, type, url, id], (error) => {
        if (error) {
            console.log("ERROR updating project:", error);
        } else {
            console.log(`Project ${id} updated successfully.`);
            res.redirect('/projects'); // Redirect back to the projects list
        }
    });
});


// create a new route for the login page
app.get('/login', (req, res) => {
    res.render('login.handlebars');
});

// create the POST route for the login form
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const model = { error: "Username and password are required.", message: "" };
        return res.status(400).render('login.handlebars', model);
    }

    if (username === adminName) {
        console.log('The username is the admin one!');

        bcrypt.compare(password, adminPassword, (err, result) => {
            if (err) {
                const model = { error: "Error while comparing passwords: " + err.message, message: "" };
                return res.render('login.handlebars', model);
            }

            if (result) { // result is true if passwords match, false otherwise
                console.log('The password is the admin one!');
                // Save information into the session upon successful login
                req.session.isAdmin = true;
                req.session.isLoggedIn = true;
                req.session.name = username;
                console.log("Session information: " + JSON.stringify(req.session));

                // Redirect to the home page after successful login
                res.redirect("/");
            } else {
                const model = { error: "Sorry, the password is not correct...", message: "" };
                res.status(400).render('login.handlebars', model);
            }
        });

    } else {
        const model = { error: `Sorry, the username ${username} is not correct...`, message: "" };
        res.status(400).render('login.handlebars', model);
    }
});

// Create the /logout route to destroy the session
app.get('/logout', (req, res) => {
    req.session.destroy((err) => { // destroy the current session
        if (err) {
            console.log("Error while destroying the session:", err);
        } else {
            console.log('Logged out...');
            res.redirect('/'); // Redirect to home
        }
    });
});

// --- ERROR HANDLING---

// 404 NOT FOUND middleware
app.use(function(req, res) {
    res.status(404).render('404.handlebars');
});



// --- LISTEN ---
const port = process.env.PORT || 8080; 
app.listen(port, function () { // listen to the port

    initTableSkills(db);
    initTableProjects(db); 
    console.log(`Server is listening on port ${port}... :)`);
});
