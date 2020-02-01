# Server

## Usage

Install Keybase
```bash
$ adduser grinchatbot
$ usermod -aG sudo username
$ su - grinchatbot
$ sudo apt update
$ curl --remote-name https://prerelease.keybase.io/keybase_amd64.deb
$ sudo apt install ./keybase_amd64.deb
$ run_keybase -g
$ keybase oneshot -u grinchatbot --paperkey "<your paperkey>"
```

Clone repo and install Node.js and npm. Also allow users to access port 80 and 443.
```bash
$ curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo apt install npm
$ git clone https://github.com/nijynot/grin-keybase-chat.git
$ cd ./server
$ npm install
$ sudo apt install authbind
$ sudo touch /etc/authbind/byport/80
$ sudo touch /etc/authbind/byport/443
$ sudo chmod 777 /etc/authbind/byport/80
$ sudo chmod 777 /etc/authbind/byport/443
```

Add Let's Encrypt using Certbot
```bash
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository universe
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install certbot
```

Start server
```
$ HTTP_PORT=80 HTTPS_PORT=443 PRIVKEY_PATH="/etc/..." FULLCHAIN_PATH="/etc/..." authbind --deep node server.js
```
