const delay = ms => new Promise(res => setTimeout(res, ms));

async function play_sound()
{
    let button = document.getElementById("play_sound_button");
    
    if(document.getElementById("inp_file").files[0] == null)
    {
        fetch('/', {
            method: 'POST'
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
    
    } else {

        const formData = new FormData();
        formData.append('file', document.getElementById("inp_file").files[0]); 
        // formData.append('name', document.getElementById("inp_file").value.split("\\")[document.getElementById("inp_file").value.split("\\").length - 1])
        var label = "океан альзиЇ";
        formData.append('text', label);
        fetch('/upload', {
            method: 'POST',
            body: formData,
            // enctype: 'multipart/form-data'
        }).then(response => response.json())
        .then(data => {});
    }

    await delay(5000);
    button.blur();
};

function onChange()
{
    var file = document.getElementById("inp_file");
    var name = file.value.split("\\");
    document.getElementById("upload_button").textContent = name[name.length-1];
}