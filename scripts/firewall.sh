#!/bin/bash

set -ex

sudo ufw default deny incoming
sudo ufw allow 22/ssh
sudo ufw allow 443/tcp

sudo ufw enable

set +x
