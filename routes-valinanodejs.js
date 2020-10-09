const fs = require('fs')

const requestHandle = (req,res) => {
  const url = req.url
  const method = req.method
  if(url === '/') {
    res.write('<html>')
    res.write('<head><title>Enter Message</title></header>')
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
    res.write('</html>')
    return res.end()
  }

  if (url === '/message' && method ==='POST') {
    const body = []
    req.on('data',(chunck) => {  
        console.log(chunck)    //litsen on 'data'
        body.push(chunck)
    })    
    return req.on('end',() => {        // listen on 'end'
        const parseBody = Buffer.concat(body).toString()
        const message = parseBody.split('=')[1]
        fs.writeFile('message.txt', message, err => {  //.writefile() async method
            res.statusCode = 302
            res.setHeader('Location','/')
            return res.end()
        })      
    })
    
  }

  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<head><title>My First page</title></header>')
  res.write('<body><h1>Hello from Node.js Server</h1></body>')
  res.write('</html>')
  res.end()
}


module.exports = requestHandle