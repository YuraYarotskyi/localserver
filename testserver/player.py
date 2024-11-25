import os


def play(song):
    if song == "default_sound":
        print("def song")
        os.system('radio_sokal_gimn.mp3')
    else:
        path = f'"uploads\\{song}"'
        print(path)
        os.system(path)
