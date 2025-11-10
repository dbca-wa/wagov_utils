#!/bin/bash

echo "Version 1.0.0";

# Health checks for kubernetes 
wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin/health_check.sh -O /bin/health_check.sh
chmod 755 /bin/health_check.sh

# Log Rotate
wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin/log_rotate.sh -O /bin/log_rotate.sh
chmod 755 /bin/log_rotate.sh

# scheduler
wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin-python/scheduler/scheduler.py -O /bin/scheduler.py
chmod 755 /bin/scheduler.py

# Add azcopy to container
mkdir /tmp/azcopy/
#wget https://aka.ms/downloadazcopy-v10-linux -O /tmp/azcopy/azcopy.tar.gz
# Temporary pin to this version as the latest is coming up 404 not found
wget https://github.com/Azure/azure-storage-azcopy/releases/download/v10.30.0/azcopy_linux_amd64_10.30.0.tar.gz -O /tmp/azcopy/azcopy.tar.gz
cd /tmp/azcopy/ ; tar -xzvf azcopy.tar.gz
# required to adjust to a later version of azcopy resolve the issue of docker builds breaking.
azcopydir=$(ls -1 /tmp/azcopy/ | grep azcopy_linux_amd64)
cp /tmp/azcopy/$azcopydir/azcopy /bin/azcopy
chmod 755 /bin/azcopy
