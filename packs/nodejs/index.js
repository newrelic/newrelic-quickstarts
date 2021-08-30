//Load HTTP module
const http = require('http')
require('newrelic')
const hostname = 'localhost'
const port = 5555
const Todo = require('./API/controller')

const server = http.createServer(async (req, res) => {
	if (req.url === '/api/getTodos' && req.method === 'GET') {
		res.statusCode = 200
		const todos = await new Todo().getTodos()
		// set the status code, and content-type
		res.writeHead(200, { 'Content-Type': 'application/json' })
		// send the data
		res.end(JSON.stringify(todos))
	} else if (
		req.url.match(/\/api\/getTodo\/([0-9]+)/) &&
		req.method === 'GET'
	) {
		try {
			// get id from url
			const id = req.url.split('/')[3]
			// get todo
			const todo = await new Todo().getTodo(id)
			res.setHeader('Access-Control-Allow-Origin', '*')
			// set the status code and content-type
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			})
			// send the data
			res.end(JSON.stringify(todo))
		} catch (error) {
			// set the status code and content-type
			res.writeHead(404, { 'Content-Type': 'application/json' })
			// send the error
			res.end(JSON.stringify({ message: error }))
		}
	} else if (req.url === '/') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.write(
			'Hello! Try an endpoint such as: /api/getTodos or /api/getTodo/3 or /api/cloudenablers'
		)
	} else if (req.url === '/api/cloudenablers' && req.method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.write('Hello from the Cloud Enablers team!')
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end('Route not found, try another one...')
	}
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
