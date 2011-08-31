#!/bin/bash
killall -u node
git stash
git pull --rebase
screen -d -m node server.js
