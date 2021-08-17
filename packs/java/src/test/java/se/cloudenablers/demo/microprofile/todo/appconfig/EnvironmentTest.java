/**
 * This test is just to verify code coverage and unit test reporting in Sonar
 *
 **/
package se.cloudenablers.demo.microprofile.todo.appconfig;


import org.junit.Test;

import static org.junit.Assert.*;

public class EnvironmentTest {

    @Test
    public void testValidEnvironments() {
        String environmentName;
        Environment environment;

        environmentName = "Development".toUpperCase();
        environment = Environment.valueOf(environmentName);
        assertTrue("Development is a valid environment",environment.toString().equals(environmentName));

        environmentName = "Production".toUpperCase();
        environment = Environment.valueOf(environmentName);
        assertTrue("Production is a valid environment",environment.toString().equals(environmentName));
    }

    @Test
    public void testInValidEnvironment() {
        try {
            String environmentName = "NonExistingEnv";
            Environment environment = Environment.valueOf(environmentName);
            fail("Exception should be thrown if invalid enviornment");
        } catch (IllegalArgumentException iae) {
            assertTrue("IllegalargumentException is thrown if invalid environment", true);
        }
    }

}