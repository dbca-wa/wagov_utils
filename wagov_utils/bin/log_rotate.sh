#!/bin/sh

# Check Log Rotate Exists
mkdir -p /app/logs/rotate1/
mkdir -p /app/logs/rotate2/
mkdir -p /app/logs/rotate3/
mkdir -p /app/logs/rotate4/
mkdir -p /app/logs/rotate5/
mkdir -p /app/logs/rotate6/
mkdir -p /app/logs/rotate7/
mkdir -p /app/logs/rotate8/
mkdir -p /app/logs/rotate9/
mkdir -p /app/logs/rotate10/
mkdir -p /app/logs/rotate11/
mkdir -p /app/logs/rotate12/

# Rotate Logs
rm -rf /app/logs/rotate12/*
mv /app/logs/rotate11/* /app/logs/rotate12/
mv /app/logs/rotate10/* /app/logs/rotate11/
mv /app/logs/rotate9/* /app/logs/rotate10/
mv /app/logs/rotate8/* /app/logs/rotate9/
mv /app/logs/rotate7/* /app/logs/rotate8/
mv /app/logs/rotate6/* /app/logs/rotate7/
mv /app/logs/rotate5/* /app/logs/rotate6/
mv /app/logs/rotate4/* /app/logs/rotate5/
mv /app/logs/rotate3/* /app/logs/rotate4/
mv /app/logs/rotate2/* /app/logs/rotate3/
mv /app/logs/rotate1/* /app/logs/rotate2/
mv /app/logs/*.log /app/logs/rotate1/
gzip /app/logs/rotate1/*.log
