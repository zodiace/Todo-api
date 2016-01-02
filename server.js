var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	}
	else {
		res.status(404).send();
	}
});

app.post('/todos', function (req, res) {
	var body = req.body;
	body = _.pick(body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).send();
	}

	body.description = body.description.trim();

	body.id = id;

	id++;

	todos.push(body);

	console.log('Description: ' + body.description);

	res.json(todos);
});

app.delete ('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	else {
		res.status(404).json({"error": "No todo found with id " + id});
	}
});

app.listen(PORT, function () {
	console.log('Express server started, listening on port ' + PORT + '...');
});