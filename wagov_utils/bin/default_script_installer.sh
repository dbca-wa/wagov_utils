#!/bin/bash

echo "Version 1.0.0";

# Health checks for kubernetes 
RUN wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin/health_check.sh -O /bin/health_check.sh
RUN chmod 755 /bin/health_check.sh

# scheduler
RUN wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin-python/scheduler/scheduler.py -O /bin/scheduler.py
RUN chmod 755 /bin/scheduler.py

# Add azcopy to container
RUN mkdir /tmp/azcopy/
RUN wget https://aka.ms/downloadazcopy-v10-linux -O /tmp/azcopy/azcopy.tar.gz
RUN cd /tmp/azcopy/ ; tar -xzvf azcopy.tar.gz
RUN cp /tmp/azcopy/azcopy_linux_amd64_10.26.0/azcopy /bin/azcopy
RUN chmod 755 /bin/azcopy
