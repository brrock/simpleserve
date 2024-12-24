# Simpleserve
Install copy files from release into /usr/local/bin or anywhere in path or install npm package gloablly with `npm i simpleserve -g`
## Usage
`` sh
simpleserve --dir [dir you want to serve] --port [port number you want to serve on] # all options are optional default dir is . and default port is 3000
``
In a function with ts
Make sure you have simpleserve installed `npm i @brrock/simpleserve`, example usage 
``` ts
import serve from "@brrock/simpleserve/function"


serve({
  port: 5174, // The port to run the server on default: 3000
  directory: 'dist', // The directory to serve static files from default .
  debug: true, // Enable debug mode to log server details default false
});


```