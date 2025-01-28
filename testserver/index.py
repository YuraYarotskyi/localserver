import os
import sys

global kill_command
kill_command = 'taskkill /im "Microsoft.Media.Player.exe" /f'

def kill():
    os.system(kill_command)
    print("\x1b[1m\x1b[92mPython:\x1b[0m Kill command sent.")


def play(song):
    kill()

    if song == "default_sound":
        print("\x1b[1m\x1b[92mPython:\x1b[0m Selected default song.")
        os.system('radio_sokal_gimn.mp3')
    else:
        path = f'"uploads\\{song}"'
        print(f"\x1b[1m\x1b[92mPython:\x1b[0m Song is being played from: {path}")
        os.system(path)


arg = sys.argv[1]
print(arg)

if arg == "server_post_kill":
    kill()
else:
    play(arg)