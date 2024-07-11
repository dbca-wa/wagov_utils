#!/usr/bin/python
import datetime
import threading
import subprocess
import time
import sys
import os
import re

version = "1.0.2"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logfile_path = ""
# Start of script file
cronfile_path  = sys.argv[1]

if len(sys.argv) > 2:
    logfile_path  = sys.argv[2]

# https://www.w3schools.com/python/python_datetime.asp
count = 1
# q
total_days_in_week = 7
total_months = 12
total_hours = 24
total_minutes = 60
total_days_in_months = { 1 : 31,
                         2 : 29, 
                         3 : 31,
                         4 : 30,
                         5 : 31,
                         6 : 30,
                         7 : 31,
                         8 : 31,
                         9 : 30,
                         10 : 31,
                         11 : 30,
                         12 : 31
}

def build_dow_interval(interval):     
    dow_interval_array = []
    d = 1  
    interval_count = 0
    interval_divide = int(total_days_in_week / int(interval))

    while d <= interval_divide:          
        interval_count = interval_count + int(interval)
        dow_interval_array.append(interval_count)
        d = d + 1
    return dow_interval_array

def build_month_interval(interval):    
     
    month_interval_array = []
    d = 1  
    interval_count = 0
    interval_divide = int(total_months / int(interval))

    while d <= interval_divide:          
        interval_count = interval_count + int(interval)
        month_interval_array.append(interval_count)
        d = d + 1
    return month_interval_array


def build_dom_interval(interval):    
    current_month = datetime.datetime.today().strftime("%-m") 
    dom_interval_array = []
    d = 1  
    interval_count = 0
    interval_divide = int(total_days_in_months[int(current_month)] / int(interval))

    while d <= interval_divide:          
        interval_count = interval_count + int(interval)
        dom_interval_array.append(interval_count)
        d = d + 1
    return dom_interval_array

def build_hour_interval(interval):          
    hour_interval_array = []    
    d = 1    
    interval_count = 0
    interval_divide = int(total_hours / int(interval))

    while d <= interval_divide:          
        interval_count = interval_count + int(interval)
        if interval_count == 24:
            hour_interval_array.append(0)
        else:
            hour_interval_array.append(interval_count)
        d = d + 1
    return hour_interval_array


def build_minute_interval(interval):          
    minute_interval_array = []    
    d = 1    
    interval_count = 0
    interval_divide = int(total_minutes / int(interval))

    while d <= interval_divide:          
        interval_count = interval_count + int(interval)
        if interval_count == 24:
            minute_interval_array.append(0)
        else:
            minute_interval_array.append(interval_count)
        d = d + 1
    return minute_interval_array

def addlog(line):
    print (line)
    dt = datetime.datetime.now()
    log_path = str(BASE_DIR)+"/logs/python-cron.log"
    if len(logfile_path) > 0:
        log_path = logfile_path
    else:        
        if not os.path.exists(str(BASE_DIR)+"/logs"):
            os.makedirs(str(BASE_DIR)+"/logs")             
    f= open(log_path,"a+")
    f.write(str(dt.strftime('%Y-%m-%d %H:%M:%S'))+': '+line+"\r\n")
    f.close()


def runjob(cmd): 

        addlog("Executing Job Preparing: "+cmd)
        output = ""
        try:

            output = subprocess.run(cmd, shell=True, capture_output=True)
            addlog("Executing Job Completed:"+cmd)
            # addlog(str(output.returncode))            
            addlog("Executing Job Output: "+str(output))            
                        
        except Exception as e:
            addlog("Error Executing:"+cmd)
            addlog(str(e))


addlog("Starting Python Cron "+version)
f = open(cronfile_path, "r")
cron_lines  = f.read()
cron_array = cron_lines.splitlines()

last_run_time = "" 
# os.exit()
while True:
    current_dow = datetime.datetime.today().strftime("%u")
    current_month = datetime.datetime.today().strftime("%-m") 
    current_day = datetime.datetime.today().strftime("%-d") 
    current_hour = datetime.datetime.today().strftime("%-H")
    current_minute = datetime.datetime.today().strftime("%-M")

    current_run_time = str(current_dow)+str(current_month)+str(current_day)+str(current_hour)+str(current_minute)
    
    if last_run_time != current_run_time:

        for line in cron_array:
            if re.search(r"^#.+", line):
            #    print ("Found Comment")
                continue
            if re.search(r"^\s+", line):
            #    print ("Found Empty Line")
                continue
            if re.search(r"^$", line):
            #    print ("Found Empty Line")
                continue        
                

            line_space_split = re.split(r"\s+", line)
            execute_script = re.sub(r"^[\d|/|*|,|-]+\s+[\d|/|*|,|-]+\s+[\d|/|*|,|-]+\s+[\d|/|*|,|-]+\s+[\d|/|*|,|-]+\s+", "", line)
            minute = line_space_split[0]
            hour = line_space_split[1]
            dom = line_space_split[2]
            month = line_space_split[3]
            dow = line_space_split[4]

            dow_run = False
            month_run = False
            dom_run = False
            hour_run = False
            minute_run = False

            # Day of Week
            if dow == '*':
                dow_run = True
            else:
                if "/" in dow:               
                    dow_split = dow.split("/")
                    bdi = build_dow_interval(dow_split[1])               
                    if int(current_dow) in bdi:
                            dow_run = True               
                
                elif "," in dow:                 
                    dow_split = dow.split(",")
                    for d in dow_split:
                        if int(current_dow) == int(d):                         
                            dow_run = True                  
                        
                elif "-" in dow:
                        dow_split = dow.split("-")

                        start_dow = int(dow_split[0])
                        while start_dow <= int(dow_split[1]):                         
                            if int(current_dow) == start_dow:
                                dow_run = True                           
                            start_dow = start_dow + 1
            # Month
            if month == '*':
                month_run = True
            else:
                if "/" in month:                  
                    month_split = month.split("/")
                    bmi = build_month_interval(month_split[1])               
                    if int(current_month) in bmi:                    
                            month_run = True                  
                elif "," in month:  
                    month_split = month.split(",")
                    for d in month_split:
                        if int(current_month) == int(d):                         
                            month_run = True                    
                elif "-" in month:
                    month_split = month.split("-")

                    start_month = int(month_split[0])
                    while start_month <= int(month_split[1]):                         
                        if int(current_month) == start_month:
                            month_run = True                           
                        start_month = start_month + 1                                  


            # Day of Month
            if dom == '*':
                dom_run = True
            else:
                if "/" in dom:                  
                    dom_split = dom.split("/")
                    bmi = build_dom_interval(dom_split[1])                                             
                    if int(current_day) in bmi:                 
                            dom_run = True
                elif "," in dom:  
                    dom_split = dom.split(",")
                    for d in dom_split:
                        if int(current_day) == int(d):                                               
                            dom_run = True  
                elif "-" in dom:
                    dom_split = dom.split("-")

                    start_dom = int(dom_split[0])
                    while start_dom <= int(dom_split[1]):                         
                        if int(current_day) == start_dom:                        
                            dom_run = True                           
                        start_dom = start_dom + 1  

            # Hour
            if hour == '*':
                hour_run = True
            else:
                
                if "/" in hour:                  
                    hour_split = hour.split("/")
                    bmi = build_hour_interval(hour_split[1])                                          
                    if int(current_hour) in bmi:                 
                            hour_run = True
                elif "," in hour:  
                    hour_split = hour.split(",")
                    for d in hour_split:
                        if int(current_hour) == int(d):                                               
                            hour_run = True  
                elif "-" in hour:
                    hour_split = hour.split("-")
                    
                    start_hour = int(hour_split[0])
                    while start_hour <= int(hour_split[1]):                         
                        if int(current_hour) == start_hour:                        
                            hour_run = True                           
                        start_hour = start_hour + 1  


            # Minute
            if minute == '*':
                minute_run = True
            else:
                if "/" in minute:                  
                    minute_split = minute.split("/")
                    bmi = build_minute_interval(minute_split[1])                                                             
                    if int(current_minute) in bmi:                 
                            minute_run = True
                elif "," in minute:  
                    minute_split = minute.split(",")
                    for d in minute_split:
                        if int(current_minute) == int(d):                                               
                            minute_run = True  
                elif "-" in hour:
                    minute_split = minute.split("-")
                    
                    start_minute = int(minute_split[0])
                    while start_minute <= int(minute_split[1]):                         
                        if int(current_minute) == start_minute:                        
                            minute_run = True                           
                        start_minute = start_minute + 1              

            # Will help with debugging time issues      
            # print (dow_run,month_run,dom_run,hour_run,minute_run)          
            thread = threading.Thread(target=runjob, args=(execute_script,))                 
            thread.start()  

        last_run_time = current_run_time

    # exit if clause

    time.sleep(15)
    count = count + 1
