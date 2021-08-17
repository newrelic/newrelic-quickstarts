package se.cloudenablers.demo.microprofile.todo.appconfig;

import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.logging.Logger;

@Startup
@Singleton
public class LogConfig {
    @Inject
    private Logger logger;

    @PostConstruct
    public void logConfiguration() {
        Config config = ConfigProvider.getConfig();
        logMPConfig(config, "environment");
        logMPConfig(config,"ds.className");
        logMPConfig(config,"ds.serverName");
        logMPConfig(config,"ds.databaseName");
        logMPConfig(config,"ds.user");
        logMPConfig(config,"ds.password");
    }

    private void logMPConfig(Config config, String mpConfigName) {
        logger.info(() -> mpConfigName + ": " + config.getValue(mpConfigName,String.class));
    }

}