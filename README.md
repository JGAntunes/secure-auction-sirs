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

#Creation of the ssl certificate
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt

Now we need to fill out the prompts on the output files. The most important line is the one that requests the Common Name (e.g. server FQDN or YOUR name). You need to enter the domain name associated with your server or, more likely, your server's public IP address.

While we are using OpenSSL, we should also create a strong Diffie-Hellman group, which is used in negotiating Perfect Forward Secrecy with clients.

We can do this by typing:

sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

Then we load the certificate on the frontend of the application.

```


# Run it
```
create the databases:

  sh create-db.sh

then run:

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
