#!/bin/bash

echo "Version 1.0.0";

# Health checks for kubernetes 
wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin/health_check.sh -O /bin/health_check.sh
chmod 755 /bin/health_check.sh

# scheduler
wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin-python/scheduler/scheduler.py -O /bin/scheduler.py
chmod 755 /bin/scheduler.py

# Add azcopy to container
mkdir /tmp/azcopy/
wget https://aka.ms/downloadazcopy-v10-linux -O /tmp/azcopy/azcopy.tar.gz
cd /tmp/azcopy/ ; tar -xzvf azcopy.tar.gz
cp /tmp/azcopy/azcopy_linux_amd64_10.26.0/azcopy /bin/azcopy
chmod 755 /bin/azcopy
