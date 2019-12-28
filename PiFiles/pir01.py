import RPi.GPIO as GPIO
import time
from datetime import datetime
import subprocess
 
GPIO.setmode(GPIO.BCM)
pirPin = 7
GPIO.setup(pirPin, GPIO.IN)
 
try:
    while True:
        if (GPIO.input(pirPin)):
            print "Motion Detected!"
	    now = datetime.now()
       	    dtString = now.strftime("%Y-%m-%d-%H-%M-%S") 
	    print dtString 
	    filename =dtString+'.jpg'
	    cmd = 'raspistill -o ' + filename
	    pid=subprocess.call(cmd, shell=True)
	else:
            print "No motion"
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
