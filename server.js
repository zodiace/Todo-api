var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id:1,
	description: 'Pick up mom from store',
	complete: false
}, {
	id:2,
	description: 'Write final report',
	complete: false
}, {
	id:3,
	description: 'Take car in for servicing',
	complete: true
}];

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
})

app.listen(PORT, function () {
	console.log('Express server started, listening on port ' + PORT + '...');
});