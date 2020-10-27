'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Enum = require('enum');
const devices = require('./data/devices.json')
const connections = require('./data/connections.json')
const helperModule= require('./helper/route-info.js')
const port = 3000

app.use(express.static('client'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const type = new Enum([
  "COMPUTER",
  "REPEATER"
]);
// let devices = [],
  // let connections = [];

// list all the devices used in network
app.get('/ajiranet/process/devices', (req, res, next) => {
  let deviceInNetwork = [];
  connections.forEach(connection =>{
    devices.forEach(device => {
      if(deviceInNetwork.length === 0){
        deviceInNetwork.push(device)
      }else{
        if(connection.source === device.name && 
          !deviceInNetwork.find(iter => iter.name === connection.source)){
          deviceInNetwork.push(device)
        }
        if(connection.destination === device.name && 
          !deviceInNetwork.find(iter => iter.name === connection.destination)){
          deviceInNetwork.push(device)
        }        
      }        
    })
  })
  res.json(deviceInNetwork)
})

// create new device api
app.post('/ajiranet/process/devices', (req, res) => {
  let uniqueName = devices.find(device => device.name === req.body.name);
  if(uniqueName){
    res.status(403).json({error: true, message: "Device already exists!"})
  } else if(!type.get(req.body.type)){
    res.status(404).json({error: true, message: req.body.type + " can't be added as device!"})
  } else{
    devices.push(req.body);
    res.status(200).json(devices);
  }  
})
// create connections api
app.post('/ajiranet/process/connections', (req, res) => {
  let targets = [...req.body.targets];
  if(!devices.find(device => device.name === req.body.source)){
    return res.status(404).json({error: true, message: "Source not registered!"})
  }
  if(devices.filter(el => targets.includes(el.name)).length!=targets.length){
    return res.status(404).json({error: true, message: "Some targets are not registered!"})
  }
  if(req.body.targets.indexOf(req.body.source)>=0){
    return res.status(651).json({error: true, message: "Device can't be connected to itself!"})
  }
  for(let iter of req.body.targets ){
    let obj = {source: req.body.source, destination: iter}    
    const connExists= connections.some(e => e.source=== obj.source && e.destination === obj.destination)
    if(!connExists){
      connections.push(obj)
    }
  }  
  return res.status(200).json(connections);  
})
// route information api
app.get("/ajiranet/process/info-routes", (req, res)=>{  
  const sourceDevice = devices.find(el => el.name === req.query.from);
  const destinationDevice = devices.find(el => el.name === req.query.to);
  if(sourceDevice.type === "REPEATER" || destinationDevice.type === "REPEATER"){
    return res.status(404).json({message: "from/to can't be REPEATER type device."})
  }else if(req.query.from=== req.query.to){
    return res.status(200).json([[{source: req.query.from, destination: req.query.to}]])
  }else{
    let list = [...connections]
    const connectionRoutes = helperModule.findPaths(list, req.query.from, req.query.to);
    if(connectionRoutes.length ===0){
      res.status(404).json({error:true, message: "NO Route"})
    }else{
      return res.status(200).json(connectionRoutes);
    }
  }
})



app.use((err, req, res, next) => {
  console.error('ERROR:', err)
})

app.listen(port, () => console.log(`Node APIs running on port: ${port}...`))