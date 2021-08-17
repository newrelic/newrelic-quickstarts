package se.cloudenablers.demo.microprofile.todo.util;

import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;
import se.cloudenablers.demo.microprofile.todo.appconfig.Environment;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
// https://www.baeldung.com/cors-in-jax-rs
public class CorsFilter implements ContainerResponseFilter {
    private Environment environment;

    public CorsFilter() {
        super();

        // @Inject of config params not working in filter
        Config config = ConfigProvider.getConfig();
        this.environment = Environment.valueOf(config.getValue("environment",String.class).toUpperCase());
    }

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        // Override CORS if running in local IDE
        if (environment == Environment.DEVELOPMENT) {
            responseContext.getHeaders().add(
                    "Access-Control-Allow-Origin", "*");
            responseContext.getHeaders().add(
                    "Access-Control-Allow-Credentials", "true");
            responseContext.getHeaders().add(
                    "Access-Control-Allow-Headers",
                    "origin, content-type, accept, authorization");
            responseContext.getHeaders().add(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        }
    }
}