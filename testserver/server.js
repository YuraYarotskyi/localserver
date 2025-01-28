const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { transliterate } = require('transliteration');

//preparating packets

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const app = express();
const port = 5767;
const upload = multer({ storage: storage });

//frameworks, settings, etc.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/', express.static('./service'));

//python child spawner

function play_music(arg)
{
    return new Promise((resolve, reject) => {

        const python_process = spawn('python', ['./index.py', arg]);
        let r_data = '';

        python_process.stdout.on('data', (data) => {
            console.log(`\x1b[1m\x1b[92mStdout:\x1b[0m ${data.toString()}`)
            r_data += data;
        });
        
        python_process.stderr.on('data', (data) => {
            console.log(`\x1b[1m\x1b[91mStderr:\x1b[0m ${data.toString()}`)
            r_data += data;
        });
        
        python_process.on('close', (code) => {
            console.log(`\x1b[1m\x1b[33mClose:\x1b[0m ${code.toString()}`)
            resolve(r_data);
        });
        
        python_process.on("error", (error) =>{
            console.log(`\x1b[1m\x1b[91mError:\x1b[0m ${error.toString()}`)
            reject(new Error(error))
        });
    });
};

function stop_music()
{
    return new Promise((resolve, reject) => {

        const python_process = spawn('python', ['./index.py', "server_post_kill"]);
    
        python_process.stdout.on('data', (data) => {
            console.log(`\x1b[1m\x1b[92mStdout:\x1b[0m ${data.toString()}`)
        });
        
        python_process.stderr.on('data', (data) => {
            console.log(`\x1b[1m\x1b[91mStderr:\x1b[0m ${data.toString()}`)
        });
        
        python_process.on('close', (code) => {
            console.log(`\x1b[1m\x1b[33mClose:\x1b[0m ${code.toString()}`)
            resolve(1);
        });
        
        python_process.on("error", (error) =>{
            console.log(`\x1b[1m\x1b[91mError:\x1b[0m ${error.toString()}`)
            reject(new Error(error))
        });
    });
};

//get

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '/service/index.html')
    );
});

//posts

app.post('/', (req, res) => {

    play_music(req.body.play_type).then(function(msg)
    {
        res.json(msg);
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    
    var file = req.file;
    console.log(file);
    if(file)
    {
        res.json('0');
    } else {
        res.json('500');
    }
});

app.post('/upload/transliterate', (req, res) =>{
    res.json(transliterate(req.body.name));
});

app.post('/kill_sound', (req, res) =>{
    stop_music();
});

//listener

app.listen(port, () => {
    console.log(`Server is running on port \x1b[1m\x1b[94m${port}\x1b[0m`);
});