var express = require('express');

var bodyParser = require('body-parser')

var fs = require('fs');

var fileName = './settings.json';
var file = require(fileName);

const fileUpload = require('express-fileupload');

var app = express()

const test = {
    "salut": 1
}

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/settings', function (req, res) {
    res.json(file);
})

app.post('/settings', function (request, response) {
    console.log(request.body); // your JSON

    fs.writeFile(fileName, JSON.stringify(request.body), function (err) {
        if (err) return console.log(err);
    });

    response.send(request.body); // echo the result back
});

app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let sampleFile = req.files.image;

    // allow to know if there is only one "object" or not
    if (Object.keys(sampleFile).length === 7) {
        uploadPath = __dirname + '/img/yakuzas/' + sampleFile.name;
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            modifyJson(sampleFile);
        });
    } else {
        sampleFile.forEach(file => {
            uploadPath = __dirname + '/img/yakuzas/' + file.name;
            file.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                modifyJson(sampleFile);
            });
        });
    }



    res.send('File uploaded to ' + uploadPath);
});

function modifyJson(slide) {
    console.log('slide');
    file.slideshow.slides.push({
        image: {
            URL: "img/yakuzas/" + slide.name,
            animation: {
                type: "zoom",
                from: 0.9,
                to: 1.2
            }
        },
        text: {
            content: "Nouvelle slide",
            animation: {
                type: "move",
                from: [
                    100,
                    200
                ],
                to: [
                    150,
                    200
                ]
            },
            css: {
                fontSize: "12px",
                color: "#9b923e"
            }
        }
    });

    fs.writeFile(fileName, JSON.stringify(file), function (err) {
        if (err) return console.log(err);
    });

}

app.listen(8181)