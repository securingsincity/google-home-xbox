import sys
import logging
import argparse
import os

from xbox.webapi.authentication.manager import AuthenticationManager
from xbox.sg import enum
from xbox.sg.manager import InputManager, TextManager, MediaManager
from xbox.sg.console import Console
from xbox.sg.enum import ConnectionState
from xbox.sg.scripts import TOKENS_FILE
from flask import Flask, jsonify
app = Flask(__name__)
xbox_username = os.environ.get('XBOX_USERNAME', '')
xbox_device_id = os.environ.get('XBOX_DEVICE_ID', '')
xbox_password = os.environ.get('XBOX_PASSWORD', '')


def authenticate():
    try:
        auth_mgr = AuthenticationManager.from_file(TOKENS_FILE)
        auth_mgr.email_address = xbox_username
        auth_mgr.password = xbox_password
        auth_mgr.authenticate()
        auth_mgr.dump(TOKENS_FILE)
        return auth_mgr
    except Exception as e:
        print("Failed to authenticate with provided tokens, Error: %s" % e)
        print("Please re-run xbox-authenticate to get a fresh set")
        sys.exit(1)


def send_command_to_consoles(auth_mgr, command):
    userhash = auth_mgr.userinfo.userhash
    token = auth_mgr.xsts_token.jwt
    consoles = Console.discover(timeout=1)
    if not len(consoles):
        print("No consoles found!")
        sys.exit(1)

    for c in consoles:
        state = c.connect(userhash, token)
        if state != ConnectionState.Connected:
            print("Connecting to %s failed" % c)
            continue
        c.wait(1)
        getattr(c, command)(xbox_device_id, tries=10)


def send_media_command(console, command):
    title_id = 0
    request_id = 0
    console.media_command(title_id, command, request_id)
    return True


@app.route("/")
def index():
    return jsonify({
        'status': 'Hello World!'
    })


@app.route("/power", methods=['POST'])
def powerOn():
    auth_mgr = authenticate()
    send_command_to_consoles(auth_mgr, 'power_on')
    return jsonify({
        'status': 'success'
    })


@app.route("/power", methods=['DELETE'])
def powerOff():
    auth_mgr = authenticate()
    send_command_to_consoles(auth_mgr, 'power_off')
    return jsonify({
        'status': 'success'
    })
