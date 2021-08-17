package se.cloudenablers.demo.microprofile.todo.todoitem;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TodoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Boolean isComplete;

    public TodoItem() {

    }

    public TodoItem(String name, Boolean isComplete) {
        super();

        this.name = name;
        this.isComplete = isComplete;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getComplete() {
        return isComplete;
    }

    public void setComplete(Boolean complete) {
        isComplete = complete;
    }

    @Override
    public String toString() {
        return String.format("TodoItem [id=%s, name=%s, isComplete=%s]", id, name, isComplete);
    }

}