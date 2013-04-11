function MainCtrl($scope) {

    $scope.todos = [];

    $scope.pouchdb = Pouch('idb://angularpouchtodo', function(err, db) {
        if (err) {
            console.log(err);
        }
        else {
            db.allDocs(function(err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    $scope.loadTodos(response.rows);
                }
            });
        }
    });

    $scope.loadTodos = function(todos) {
        for (var i = 0; i < todos.length - 1; i++) {
            var todo = todos[i];
            $scope.pouchdb.get(todo.id, function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    $scope.$apply(function() {
                        $scope.todos.push(doc);
                    });
                }
            });
        };
    }

    $scope.addTodo = function() {
        var newTodo = {
            _id: Math.uuid(),
            text: $scope.todoText,
            done: false
        };
        $scope.todos.push(newTodo);
        $scope.todoText = '';
        $scope.pouchdb.put(newTodo);
    };

    $scope.updateTodo = function(todo) {
        $scope.pouchdb.put(todo);
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.removeDone = function() {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) {
                $scope.todos.push(todo);
            }
            else {
                $scope.removeTodo(todo);
            }
        });
    };

    $scope.removeTodo = function(todo) {
        $scope.pouchdb.get(todo._id, function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                $scope.pouchdb.remove(doc, function(err, response) {
                    console.log(response);
                });
            }
        });
    };
}