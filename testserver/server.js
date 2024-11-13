const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('./service'));


function play_music()
{
    return new Promise((resolve, reject) => {
        const python_process = spawn('python', ['./index.py']);
        let r_data = '';
    
        python_process.stdout.on('data', (data) => {
            r_data += data.toString();
            console.log(`Stdout: ${data.toString()}`)
        });
        
        python_process.stderr.on('data', (data) => {
            console.log(`Stderr: ${data.toString()}`)
        });
        
        python_process.on('close', (code) => {
            console.log(`Close: ${code.toString()}`)
            resolve(r_data.trim());
        });
        
        python_process.on("error", (error) =>{
            console.log(`Error: ${error.toString()}`)
            reject(new Error(error))
        });
    });
}


app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '/service/index.html')
    );
});

app.post('/', (req, res) => {
    const data = req.body.rq;

    if (data == 'play')
    {
        play_music().then(function(msg)
        {
            console.log(msg);
            res.json(msg);
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});