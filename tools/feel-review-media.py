"""Export own recordings, trimming setup, and sample motion boards with installed ffmpeg."""
from pathlib import Path
import subprocess
root=Path('review/feel')
for name,seconds in [('wave3-4',38),('blade',10),('density',30),('corner-atmosphere',12)]:
 src=root/f'{name}.webm'
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(src)],text=True))
 # Keep the final action segment; loading/setup is recorded before the timed driver starts.
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(max(0,duration-seconds)),'-i',str(src),'-t',str(seconds),'-vf','scale=1280:-2','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(root/f'{name}.mp4')],check=True)
 step=seconds/9
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(root/f'{name}.mp4'),'-vf',f'fps=1/{step},scale=422:-2,tile=3x3','-frames:v','1',str(root/f'{name}-motion-board.jpg')],check=True)
