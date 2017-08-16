
interface XBOXConstructor {
  new (ip: string, id: string): XBOXInstance
}
interface XBOXInstance {
  powerOn: () => void
}

const xboxOn: XBOXConstructor = require("xbox-on");
import * as express from 'express'


const app = express()
const deviceIp = process.env.XBOX_IP || '192.168.1.1'
const deviceId = process.env.XBOX_DEVICE_ID || 'FOOBARBAZ'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/power', function(req, res) {
  const xbox = new xboxOn(deviceIp,deviceId)
  xbox.powerOn()
  res.json({status: 'success'})
});

app.listen(3000, function () {
  console.log('Xbox Power App listening on port 3000!')
})
