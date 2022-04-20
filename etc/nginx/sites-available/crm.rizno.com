server {
    listen 3000;
    root /home/chl/chat;
    index index.html index.htm;
 
    server_name _;
 
    location / {
        proxy_pass https://crm.rizno.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}