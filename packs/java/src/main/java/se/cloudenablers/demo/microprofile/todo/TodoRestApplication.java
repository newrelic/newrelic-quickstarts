package se.cloudenablers.demo.microprofile.todo;


import org.eclipse.microprofile.auth.LoginConfig;

import javax.annotation.security.DeclareRoles;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

/**
 *
 */
@ApplicationPath("/api")
@ApplicationScoped

@LoginConfig(authMethod = "MP-JWT")
@DeclareRoles({"protected"})

public class TodoRestApplication extends Application {
}
