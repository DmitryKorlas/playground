### pm2 failover example

Few basic commands to keep in mind:
 
Start processes
```sh
$ pm2 start processes.json
```

View logs
```sh
$ pm2 logs
```

Start processes monitor
```sh
$ pm2 monit
```

Get information for the particular process
```sh
$ pm2 describe worker-app
```

Stop processes
```sh
$ pm2 delete processes.json
```
