const delay = ms => new Promise(res => setTimeout(res, ms));

async function play_sound()
{
    let button = document.getElementById("play_sound_button");
    let rq = "play";
    
    console.log(1);

    fetch('/', {
        method: 'POST',
        body: JSON.stringify({rq}),
        headers: {'Content-Type': 'application/json' }
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    });


    await delay(5000);
    button.blur();
    
};

function onChange(inp)
{
    var file = inp.value;
    var name = file.split("\\");

    document.getElementById("file_upload_label").textContent = name[name.length - 1];
}