# TodoAPI MicroProfile

This is an example of a MicroProfile REST API Backend. Used separately as is or together with the todo-ui frontend.

## Installation instructions
1. Install Docker if not done already
1. Open Terminal
1. Clone this repo

## Create Docker image and run Docker container
See comments in Dockerfile

## Create Docker Stack together with SwaggerUI
See comments in docker-stack-todoapi.yml

## Urls
Raw API: http://localhost:8080/api/todo

Plus see URLs in Dockerfile & docker-stack-todoapi.yml

## Running without Docker
Running from Maven or in your IDE

The generation of the executable jar file can be performed by issuing the following command

    mvn clean package

This will create an executable jar file **todo-microbundle.jar** within the _target_ maven folder. This can be started by executing the following command

    java -jar target/todoapi-microprofile-java-microbundle.jar
    
But the app requires that the environment variables is set to be able to create the datasource - to use the default ones 
with the embedded H2 db (as set in the Dockerfile) - set as below either in your IDE or in a script (depending how you
run the app):

    # Default DB connection (as @DataSourceDefinition in Payara don't take defaults from microprofile-config.properties for
    # some reasion (probably just a bug)
    DS_CLASSNAME=org.h2.jdbcx.JdbcDataSource
    DS_URL=jdbc:h2:mem:test
    DS_SERVERNAME=""
    DS_DATABASENAME=""
    DS_USER=""
    DS_PASSWORD=""
        
To launch the test page, open your browser at the following URL

    http://localhost:8080/index.html
    
## @Todo for the Todo Backend
* Document API according to [MicroProfile OpenAPI annotations](https://download.eclipse.org/microprofile/microprofile-open-api-1.0/microprofile-openapi-spec.html#_annotations)
* Implement error details according to [RFC-7807](https://tools.ietf.org/html/rfc7807.html)
* Implement [MicroProfile REST Client](https://download.eclipse.org/microprofile/microprofile-rest-client-1.1/microprofile-rest-client.html) example
* [JWT](https://github.com/eclipse/microprofile-jwt-auth)

## Specification examples

This examples are not belonging specifically to the TodoAPI Rest Backend, they were created by using MicroProfile 
Starter as a tool to generate the MicroProfile project with samples.
 
By default, there is always the creation of a JAX-RS application class to define the path on which the JAX-RS endpoints are available.

Also, a simple Hello world endpoint is created, have a look at the class **HelloController**.

More information on MicroProfile can be found [here](https://microprofile.io/)


### Config

Configuration of your application parameters. Specification [here](https://microprofile.io/project/eclipse/microprofile-config)

The example class **ConfigTestController** shows you how to inject a configuration parameter and how you can retrieve it programmatically.



### Fault tolerance

Add resilient features to your applications like TimeOut, RetryPolicy, Fallback, bulkhead and circuit breaker. Specification [here](https://microprofile.io/project/eclipse/microprofile-fault-tolerance)

The example class **ResilienceController** has an example of a FallBack mechanism where an fallback result is returned when the execution takes too long.



### Health

The health status can be used to determine if the 'computing node' needs to be discarded/restarted or not. Specification [here](https://microprofile.io/project/eclipse/microprofile-health)

The class **ServiceHealthCheck** contains an example of a custom check which can be integrated to health status checks of the instance.  The index page contains a link to the status data.



### Metrics

The Metrics exports _Telemetric_ data in a uniform way of system and custom resources. Specification [here](https://microprofile.io/project/eclipse/microprofile-metrics)

The example class **MetricController** contains an example how you can measure the execution time of a request.  The index page also contains a link to the metric page (with all metric info)



### JWT Auth

Using the OpenId Connect JWT token to pass authentication and authorization information to the JAX-RS endpoint. Specification [here](https://microprofile.io/project/eclipse/microprofile-rest-client)

Have a look at the **JWTClient** class which calls the protected endpoint on the server from a Java Main method.
The **ProtectedController** contains the protected endpoint since it contains the _@RolesAllowed_ annotation on the JAX-RS endppoint method.




### Open API

Exposes the information about your endpoints in the format of the OpenAPI v3 specification. Specification [here](https://microprofile.io/project/eclipse/microprofile-open-api)

The index page contains a link to the OpenAPI information of your endpoints.




### Open Tracing

Allow the participation in distributed tracing of your requests through various micro services. Specification [here](https://microprofile.io/project/eclipse/microprofile-opentracing)

Example needs to be created.




### Rest Client

A type safe invocation of HTTP rest endpoints. Specification [here](https://microprofile.io/project/eclipse/microprofile-rest-client)

Example needs to be created.

