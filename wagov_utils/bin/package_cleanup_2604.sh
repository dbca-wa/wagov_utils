#!/bin/bash
echo "Package Cleanup Version 1.0.0";
rm -rf /usr/bin/chisel
rm -rf /tmp/chisel
apt remove python3-jaraco.context -y 
apt remove python3-wheel -y 
rm -f /usr/bin/pebble && rm -rf /var/lib/pebble
apt autoremove -y
