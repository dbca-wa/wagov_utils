# Add azcopy to container
# mkdir /tmp/azcopy/
#wget https://aka.ms/downloadazcopy-v10-linux -O /tmp/azcopy/azcopy.tar.gz
# Temporary pin to this version as the latest is coming up 404 not found
# LATEST_TAG=$(wget -qO- https://api.github.com/repos/Azure/azure-storage-azcopy/releases/latest | grep -oP '"tag_name": "\K[^"]+')
# VERSION="${LATEST_TAG#v}"
# wget https://github.com/Azure/azure-storage-azcopy/releases/download/${LATEST_TAG}/azcopy_linux_amd64_${VERSION}.tar.gz -O /tmp/azcopy/azcopy.tar.gz
# cd /tmp/azcopy/ ; tar -xzvf azcopy.tar.gz
# # required to adjust to a later version of azcopy resolve the issue of docker builds breaking.
# azcopydir=$(ls -1 /tmp/azcopy/ | grep azcopy_linux_amd64)
# cp /tmp/azcopy/$azcopydir/azcopy /bin/azcopy
# chmod 755 /bin/azcopy
