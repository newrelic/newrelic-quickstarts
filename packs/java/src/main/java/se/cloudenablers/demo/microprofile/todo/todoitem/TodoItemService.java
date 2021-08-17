package se.cloudenablers.demo.microprofile.todo.todoitem;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.List;
import java.util.logging.Logger;

@Stateless
@Path("todo")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TodoItemService {
    @PersistenceContext(unitName = "todo-pu")
    private EntityManager em;

    @Inject
    private Logger logger;

    @GET
    @Path("{id}")
    public TodoItem find(@PathParam("id") Long id) {
        TodoItem todoItem = em.find(TodoItem.class,id);
        if (todoItem == null) {
            throw new NotFoundException("TodoItem not found with id: " + id.toString());
        }
        return todoItem;
    }

    @GET
    public List <TodoItem> findAll() {
        logger.info("Inside findALl()");
        List < TodoItem > todoItems = null;
        try {
            todoItems = em.createQuery("select object(t) from TodoItem t")
                    .getResultList();
        } catch (NoResultException ex) {
            logger.info("No todo items found");
        }
        return todoItems;
    }

    @POST
    @Transactional
    public Response create(TodoItem todoItem) {
        if (todoItem == null) {
            throw new BadRequestException("Cant create null todo item");
        }

        em.persist(todoItem);

        final URI newResourceURI = UriBuilder.fromResource(TodoItemService.class).path("/{id}").build(todoItem.getId());
        return Response.created(newResourceURI).entity(todoItem).build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, TodoItem todoItem) {
        if (todoItem == null || !id.equals(todoItem.getId())) {
            throw new BadRequestException("Cant update null todo item or todo item with missing id");
        }
        em.merge(todoItem);
        return Response.noContent().build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        TodoItem todoItem = em.find(TodoItem.class,id);
        if (todoItem == null) {
            throw new NotFoundException("TodoItem not found with id: " + id.toString());
        }
        em.remove(todoItem);
        return Response.noContent().build();
    }

    protected EntityManager getEntityManager() {
        return em;
    }
}