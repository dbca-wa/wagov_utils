#!/bin/bash

URL=$1;

# health check script for kubernetes
#wget -q -O - "http://localhost:8080/"
if [ -z "${URL}" ];
then
        echo "No Health Check URL Provided"
        exit 1
fi

wget -q -O - "$URL";
status=$?
if [ $status -ne 0 ]; then
  echo "URL Failed $URL with error code $status"
  exit 1
fi
exit 0
