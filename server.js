const express=require('express')

const port=8080
const { engine }=require('express-handlebars') // load the handlebars package for express

const app=express()
app.use(express.static('public')
)
/*app.get('/', function(req, res){
    res.send('')
})*/

// Projects data (JSON variable)
const projects = [
    {
        id: 1,
        title: "Digital Portrait Series",
        type: "Teaching",
        year: 2023,
        description: "Interactive digital art workshop teaching portrait composition and digital painting techniques",
        image: "digital-portraits.jpg",
        url: "https://github.com/example/digital-portraits"
    },
    {
        id: 2,
        title: "AI-Generated Art Research",
        type: "Research",
        year: 2023,
        description: "Exploring the intersection of artificial intelligence and creative expression through generative art",
        image: "ai-art-research.jpg",
        url: "https://github.com/example/ai-art-research"
    },
    {
        id: 3,
        title: "Abstract Watercolor Workshop",
        type: "Teaching",
        year: 2022,
        description: "Hands-on workshop exploring fluid watercolor techniques and abstract composition principles",
        image: "watercolor-workshop.jpg",
        url: "https://github.com/example/watercolor-workshop"
    },
    {
        id: 4,
        title: "Color Theory in Digital Media",
        type: "Research",
        year: 2022,
        description: "Research study on color perception and emotional response in digital art installations",
        image: "color-theory-study.jpg",
        url: "https://github.com/example/color-theory-study"
    },
    {
        id: 5,
        title: "Sculpture Fundamentals Course",
        type: "Teaching",
        year: 2024,
        description: "Comprehensive course covering clay modeling, stone carving, and metal sculpting techniques",
        image: "sculpture-course.jpg",
        url: "https://github.com/example/sculpture-course"
    },
    {
        id: 6,
        title: "Mixed Media Installation Study",
        type: "Research",
        year: 2024,
        description: "Investigation of audience interaction with multimedia art installations in gallery spaces",
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

app.get('/about', (req, res) => {
    res.render('cvjl', { 
        title: 'About Me - CV' 
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Contact Information' 
    });
});

app.get('/projects', (req, res) => {
    res.render('projects', { 
        title: 'My Projects',
        projects: projects 
    });
});


app.get('/game', function(req, res){
    res.sendFile('/Users/Admin/Desktop/unicoding/project-WebDevFun-2024/views/index.html')
})


app.listen(port, function (){
    console.log('server up and running, listening on port '+`${port}`+'...    :)')
})






const fs=require('fs')
const sqlite3 = require('sqlite3')
const dbFile='my-project-data.sqlite3.db'
db = new sqlite3.Database(dbFile)

// creates table projects at startup
db.run("CREATE TABLE Person (pid INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, age INTEGER, email TEXT)", (error) => {
    if (error) {
      // tests error: display error
      console.log("---> ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table created!")
      db.run("INSERT INTO Person (fname, lname, age, email) VALUES ('John', 'Smith', 25, 'john.smith@example.com'), ('Jane', 'Doe', 30, 'jane.doe@mail.com'), ('Alex', 'Johnson', 40, 'alex.johnson@company.com'), ('Emily', 'Brown', 35, 'emily.brown@business.org'), ('Michael', 'Davis', 50, 'michael.davis@email.net'), ('Sarah', 'Miller', 28, 'sarah.miller@example.com'), ('David', 'Garcia', 45, 'david.garcia@mail.com'), ('Laura', 'Rodriguez', 32, 'laura.rodriguez@company.com'), ('Chris', 'Wilson', 27, 'chris.wilson@business.org'), ('Anna', 'Martinez', 22, 'anna.martinez@email.net'), ('James', 'Taylor', 53, 'james.taylor@example.com'), ('Patricia', 'Anderson', 44, 'patricia.anderson@mail.com'), ('Robert', 'Thomas', 38, 'robert.thomas@company.com'), ('Linda', 'Hernandez', 55, 'linda.hernandez@business.org'), ('William', 'Moore', 26, 'william.moore@email.net'), ('Barbara', 'Jackson', 37, 'barbara.jackson@example.com'), ('Richard', 'White', 49, 'richard.white@mail.com'), ('Susan', 'Lee', 24, 'susan.lee@company.com'), ('Joseph', 'Clark', 41, 'joseph.clark@business.org'), ('Jessica', 'Walker', 29, 'jessica.walker@email.net');" , function (err) {
        if (err) {
            console.log(err.message)
        } else {
            console.log('---> Rows inserted in the table Person.')
        }
      }) 
    }
})

app.get('/rawpersons', function (req, res){
    db.all('SELECT * FROM Person', function (err, rawPersons){
        if(err){
            console.log('Error: '+err)
        } else {
            console.log('Data found, sending it back to the client...')
            res.send(rawPersons)
        }
    })
})

app.get('/listpersons', function(req, res){
    db.all('SELECT * FROM Person', function(err, rawPersons){
        if(err){
            console.log('Error: '+err)
        } else {
            listPersonsHTML='<ul>'
            rawPersons.forEach( function(onePerson){
                listPersonsHTML+='<li>'
                listPersonsHTML+=`${onePerson.fname}, `
                listPersonsHTML+=
                listPersonsHTML+=
                listPersonsHTML+=
                listPersonsHTML+='</li>'
            })
            listPersonsHTML+='</ul>'
            //console.log(listPersonsHTML)
            res.send(listPersonsHTML)
        }
    })
})

// HANDLEBARS
app.engine('handlebars', engine()) // initialize the engine to be handlebars
app.set('view engine', 'handlebars') // set handlebars as the view engine
app.set('views','./views') // define the views directory to be ./views

// create the (default) route /
app.get('/',function(req,res){
    //res.send('I am Demetris... :)')
    res.render('home.handlebars')
}) 

// create a new route to send back my CV
app.get('/about', function(req,res){
    //res.sendFile(__dirname+'/views/mycb-04.html')
    res.render('cvjl.handlebars')
})