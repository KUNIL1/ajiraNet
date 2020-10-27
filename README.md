# ajiraNet
1. Donload node version @8.9.0
2. git clone https://github.com/KUNIL1/ajiraNet.git
3. cd agiraNet
4. npm i
5. npm start

# APIs list
1. POST: 
http://localhost:3000/ajiranet/process/devices
request: 
{
    "type": "COMPUTER",
    "name": "A1"
}
Response: Added device details/erroe
2. GET:
http://localhost:3000/ajiranet/process/devices
Response: list all device in network
3. POST:
http://localhost:3000/ajiranet/process/connections
request:
{
    "source": "A1", 
    "targets": ["A3", "A2" ]
}
Response: new connection details/error
4. GET:
http://localhost:3000/ajiranet/process/info-routes?from=A3&to=A2
request: in param/query
Response: routes information if exists