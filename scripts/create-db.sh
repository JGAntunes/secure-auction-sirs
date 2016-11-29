#!/bin/bash
set -ex

sudo -u postgres \
psql -d template1 -U postgres -c "
  CREATE USER root WITH PASSWORD 'rootroot';
  CREATE DATABASE sirs;
  GRANT ALL PRIVILEGES ON DATABASE sirs to root;
  GRANT ALL PRIVILEGES ON DATABASE sirs to $(whoami);
"

set +x
