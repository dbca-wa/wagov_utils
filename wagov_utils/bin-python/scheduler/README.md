# Python Scheduler 
Is in replacement cron scheduler that can be used in place of crond.   It can be used with the same crontab file by removing the user column.   The scheduler will only run as the user its has been executed in and is a good replacement for use with in a docker image to run scripts on schedule that only need be execute under one user.


create text file eg: python-cron with the follow example cron file 
NOTE: If you are copy of and existing cron remember to remove the user column
```
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * Command
  
* */2 * 1,10,20 1-5  execute.sh / execute.py script etc


To start the scheduler

```
python scheduler.py ../python-cron   
```
To specific the location of the log files

```
python scheduler.py ../python-cron ../logs/python-cron.log
```
