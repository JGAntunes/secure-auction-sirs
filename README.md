# secure-auction-sirs
Secure auction site project fro SIRS class

Needs NodeJS >= 6.x to run

#The Firewall
```
sudo apt-get install ufw

If your VPS is configured for IPv6, ensure that UFW is configured to support IPv6 so that will configure both your IPv4 and IPv6 firewall rules. Do do this:

sudo vi /etc/default/ufw
Then make sure "IPV6" is set to "yes", like so:

IPV6=yes

and then

sudo ufw disable
sudo ufw enable

then run firewall.sh
```

# Run it
```
npm install
npm start

#then visit http://localhost://3000
```

Or, if you live on the bleeding edge
```
yarn
yarn start

#then visit http://localhost://3000
```
