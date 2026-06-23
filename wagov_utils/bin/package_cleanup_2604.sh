wget https://raw.githubusercontent.com/dbca-wa/wagov_utils/main/wagov_utils/bin/default_script_installer.sh -O /tmp/default_script_installer.sh
chmod 755 /tmp/default_script_installer.sh
/tmp/default_script_installer.sh
rm -rf /usr/bin/chisel
rm -rf /tmp/chisel
apt remove python3-jaraco.context -y 
apt remove python3-wheel -y 
rm -f /usr/bin/pebble && rm -rf /var/lib/pebble
apt autoremove -y
