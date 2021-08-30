const data = require("./data");

class Controller {
    // getting all todos
    async getTodos() {
        // return all todos
        return new Promise((resolve, _) => resolve(data));
    }

    // getting a single todo
    async getTodo(id) {
        return new Promise((resolve, reject) => {
            // get the todo
            let todo = data.find((todo) => todo.id === parseInt(id));
            if (todo) {
                // return the todo
                resolve(todo);
            } else {
                // return an error
                reject(`Todo with id ${id} not found `);
            }
        });
    }
}
module.exports = Controller;