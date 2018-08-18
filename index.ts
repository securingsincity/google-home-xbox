
interface XBOXConstructor {
  new (ip: string, id: string): XBOXInstance
}
interface XBOXInstance {
  powerOn: () => void
}

const xboxOn: XBOXConstructor = require("xbox-on");
import * as express from 'express'
import { exec } from 'child_process';


const app = express()
const deviceIp = process.env.XBOX_IP || '192.168.1.1'
const deviceId = process.env.XBOX_DEVICE_ID || 'FOOBARBAZ'
const username = process.env.XBOX_USERNAME || 'FOOBARBAZ'
const password = process.env.XBOX_PASSWORD || 'FOOBARBAZ'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/power', function(req, res) {
  const xbox = new xboxOn(deviceIp,deviceId)
  xbox.powerOn()
  res.json({status: 'success'})
});

app.delete('/power', function (req, res) {
  exec(`xbox-authenticate --email ${username} --password ${password}`);
  exec(`xbox-poweroff --liveid ${deviceId}`);
})

app.listen(3000, function () {
  console.log('Xbox Power App listening on port 3000!')
})
