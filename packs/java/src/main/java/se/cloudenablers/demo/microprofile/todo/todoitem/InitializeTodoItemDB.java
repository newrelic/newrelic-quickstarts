package se.cloudenablers.demo.microprofile.todo.todoitem;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.logging.Logger;

@Startup
@Singleton
public class InitializeTodoItemDB {
    @Inject
    private TodoItemService todoItemService;

    @Inject
    private Logger logger;

    @PostConstruct
    public void init() {
        if (todoItemService.findAll().isEmpty()) {
            logger.info("Empty database, creating a few todos");

            TodoItem drinkCoffe = new TodoItem("Drink Coffé", false);
            TodoItem debugCode = new TodoItem("Debug Code", true);
            TodoItem cleanDesk = new TodoItem("Clean my Desk", false);

            todoItemService.create(drinkCoffe);
            todoItemService.create(debugCode);
            todoItemService.create(cleanDesk);
        }
    }

}