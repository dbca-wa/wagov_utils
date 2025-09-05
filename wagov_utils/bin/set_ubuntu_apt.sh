#!/bin/bash

cat > /etc/apt/sources.list.d/ubuntudbca.sources << EOF

## See the sources.list(5) manual page for further settings.
Types: deb
URIs: http://mirror.pilotfiber.com/ubuntu/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

## Ubuntu security updates. Aside from URIs and Suites,
## this should mirror your choices in the previous section.
Types: deb
URIs: http://mirror.pilotfiber.com/ubuntu/
Suites: noble-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
EOF


rm /etc/apt/sources.list.d/ubuntu.sources
