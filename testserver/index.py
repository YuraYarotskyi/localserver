import os
import sys

def kill():
    os.system('taskkill /im "Microsoft.Media.Player.exe" /f')
    print("must be killed")


def play(song):
    if song == "default_sound":
        print("def song")
        os.system('radio_sokal_gimn.mp3')
    else:
        path = f'"uploads\\{song}"'
        print(path)
        os.system(path)


arg = sys.argv[1]
print(arg)

if arg == "server_post_kill":
    kill()
else:
    play(arg)