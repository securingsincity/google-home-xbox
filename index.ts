import * as express from 'express'
import { exec } from 'child_process';


const app = express()
const deviceId = process.env.XBOX_DEVICE_ID || 'FOOBARBAZ'
const username = process.env.XBOX_USERNAME || 'FOOBARBAZ'
const password = process.env.XBOX_PASSWORD || 'FOOBARBAZ'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/power', function(req, res) {
  exec(`xbox-authenticate --email ${username} --password ${password}`);
  exec(`xbox-poweron ${deviceId}`);
  res.json({status: 'success'})
});

app.delete('/power', function (req, res) {
  exec(`xbox-authenticate --email ${username} --password ${password}`);
  exec(`xbox-poweroff --liveid ${deviceId}`);
  res.json({ status: 'success' })
})

app.post('/play', function(req, res) {
  exec(`xbox-authenticate --email ${username} --password ${password}`);
  exec(`python commands.py --liveid ${deviceId} --command play`);
  res.json({status: 'success'})
});

app.delete('/play', function (req, res) {
  exec(`xbox-authenticate --email ${username} --password ${password}`);
  exec(`python commands.py --liveid ${deviceId} --command pause`);
  res.json({ status: 'success' })
})

app.listen(3001, function () {
  console.log('Xbox Power App listening on port 3001!')
})
