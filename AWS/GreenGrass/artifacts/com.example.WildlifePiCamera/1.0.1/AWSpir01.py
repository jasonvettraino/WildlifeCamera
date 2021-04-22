import RPi.GPIO as GPIO
import time
import sys
from datetime import datetime
import subprocess
import boto3

# Setup the pin to register PIR triggers 
GPIO.setmode(GPIO.BCM)
pirPin = 7
GPIO.setup(pirPin, GPIO.IN)

s3_resource = boto3.resource('s3')
 
try:
	
    while True:
    
# Check if PIR triggered 
		if (GPIO.input(pirPin)):
			print ("Motion Detected!")
			now = datetime.now()
			dtString = now.strftime("%Y-%m-%d-%H-%M-%S") 
			print (dtString) 
			filename =dtString+'.jpg'
			cmd = 'raspistill -o ' + filename
			pid=subprocess.call(cmd, shell=True)

			first_object = s3_resource.Object(
##			bucket_name="inputimage.cloudystuff.info", 
				bucket_name=sys.argv[1], 
				key=filename)

			first_object.upload_file(filename) 
		else:
			print ("No motion")
        
		time.sleep(1)
        
except KeyboardInterrupt:
	GPIO.cleanup()
