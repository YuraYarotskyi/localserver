const delay = ms => new Promise(res => setTimeout(res, ms));

//renaming and changing the file

function rename_file(name)
{
    var file = document.getElementById("inp_file").files[0];
    return new File([file], name, {type: file.type});
}

//reseting input button to the null state

function reset_file_input()
{
    document.getElementById('inp_file').value = null;
    onChange(document.getElementById('inp_file'));
}

//uploading file to the server

function upload_sound(file)
{
    var button = document.getElementById('play_sound_button');
    var def_style = button.style.color;
    button.style.color = 'red';
    const formData = new FormData();
    
    formData.append('file', file);
      
    fetch('/upload', {
        method: 'POST',
        body: formData,
        enctype: 'multipart/form-data'
    }).then(response => response.json())
    .then(data => {
        console.log(`'Upload_post_complete.'\nCode: ${data}`)
        button.style.color = def_style;
    });
}

//processing play type, sending post code to server

async function play_sound()
{    
    var button = document.getElementById('play_sound_button');
    
    if(document.getElementById("inp_file").files[0] == null)
    {
        var play_type = "default_sound";
    } else {
        var play_type = document.getElementById("upload_button").textContent;
    }
    
    fetch('/', {
        method: 'POST',
        body: JSON.stringify({play_type}),
        headers: {'Content-type': 'application/json'}
    }).then(response => response.json())
    .then(data => {
        console.log(`Play post sent. Return data: ${data}`);
    });

    await delay(5000);
    button.blur();
};

//processing input button appearance, title configuration

function onChange()
{
    var file = document.getElementById("inp_file");

    if(file.value)
    {
        var bad_symbols = '();"\', ';
        var file_name = file.value.split("\\")[file.value.split("\\").length - 1].split('.');
        var name = file_name[0];

        for(el in bad_symbols)
        {
            name = name.replaceAll(bad_symbols[el], '');
        }

    
        fetch('/upload/transliterate', {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {'Content-type': 'application/json'}
        }).then(response => response.json())
        .then(data => {
            var new_name = data + '.' + file_name[file_name.length - 1];
            document.getElementById("upload_button").textContent = new_name;
            var file = rename_file(new_name);
            upload_sound(file);
        });
        
    } else {
        document.getElementById("upload_button").textContent = "Upload your file";
    };
}

//killin' sound play process

function stop_music()
{
    fetch('/kill_sound', {
        method: 'POST'
    }).then(response=> response.json()).then(data =>{
        console.log(data);
    });
};