#!/bin/bash

# Prevent the system from suspending and screen blanking when the lid is closed
while true; do
    sleep 5
    grep -q closed /proc/acpi/button/lid/*/state && xset s off -dpms
done
