package se.cloudenablers.demo.microprofile.todo.appconfig;

import javax.annotation.sql.DataSourceDefinition;
import javax.ejb.Singleton;

@DataSourceDefinition(
        name = "java:app/jdbc/ds",
        // Problem with variable substitution for this property
        className = "${ds.className}", // is working (java system property)
        // className = "${ENV=ds.className}", // not working
        // className = "${MPCONFIG=ds.className}", // not working
        serverName = "${MPCONFIG=ds.serverName}",
        databaseName = "${MPCONFIG=ds.databaseName}",
        user = "${MPCONFIG=ds.user}",
        password = "${MPCONFIG=ds.password}",
        // Use only for overriding settings for H2 db - not for PostgreSQL
        url="${MPCONFIG=ds.url}"
)
@Singleton
public class DBConfig {
}