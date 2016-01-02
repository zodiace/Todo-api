var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var id = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('todo API root/');
});

app.get('/todos', function (req, res) {
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;

	todos.forEach(function (todo) {
		if (todo.id === todoId) {
			matchedTodo = todo;
		}
	})

	if (matchedTodo) {
		res.json(matchedTodo);
	}
	else {
		res.status(404).send();
	}
});

app.post('/todos', function (req, res) {
	var body = req.body;

	body.id = id;

	id++;

	todos.push(body);

	console.log('Description: ' + body.description);

	res.json(todos);
});

app.listen(PORT, function () {
	console.log('Express server started, listening on port ' + PORT + '...');
});