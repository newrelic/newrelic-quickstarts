# Multi-step build createing separate layers of dependencies and application to optimize docker image layer caching
#
# docker build -t todoapi-microprofile-java .
# docker run -p 8090:8080 --env-file new-relic-enabled.env todoapi-microprofile-java
#
# To run with PostgreSQL (exposed on localhost):
# docker run -p 8090:8080 --env-file postgres-db.env todoapi-microprofile-java
#
# http://localhost:8090/api/todo
#
# As a Docker Swarm service:
# docker service create -p 8090:8080 --name todoapi todoapi-microprofile-java

# Step 1: Build
FROM maven:3.6-jdk-8-alpine as builder

# First copy pom.xml and build all dependencies for offline use to create a separate layer to utilize Docker layer
# cache as dependencies dont change as often as code
COPY pom.xml .
COPY sonar-project.properties .
RUN mvn dependency:go-offline -B

# Copy the source code and build the package
COPY src src
RUN mvn package

# Step 2 Create the Runtime image
FROM payara/micro:5.191

ENV APP_NAME=todoapi-microprofile-java
ENV DEPENDENCY_DIR=target

# Default DB connection (as @DataSourceDefinition in Payara don't take defaults from microprofile-config.properties for
# some reasion (probably just a bug)
ENV DS_CLASSNAME=org.h2.jdbcx.JdbcDataSource
ENV DS_URL=jdbc:h2:mem:test
ENV DS_SERVERNAME=""
ENV DS_DATABASENAME=""
ENV DS_USER=""
ENV DS_PASSWORD=""

# NewRelic APM Java Agent
ARG NEW_RELIC_VERSION=4.12.1
# Override in stack file to enable New Relic inststrumentation
ENV NEW_RELIC_AGENT_ENABLED=false
# Installation
USER root
ENV NEW_RELIC_DIR=${PAYARA_PATH}/newrelic
RUN mkdir -p ${NEW_RELIC_DIR}
COPY newrelic/newrelic.yml ${NEW_RELIC_DIR}
ENV NEW_RELIC_BASE_URL=https://download.newrelic.com/newrelic/java-agent/newrelic-agent
ENV NEW_RELIC_URL=${NEW_RELIC_BASE_URL}/${NEW_RELIC_VERSION}/newrelic-agent-${NEW_RELIC_VERSION}.jar
RUN wget --quiet -O ${NEW_RELIC_DIR}/newrelic.jar ${NEW_RELIC_URL} && chown -R payara:payara ${NEW_RELIC_DIR}
USER payara

# Copy exploded WAR (unnecessary to unpack it at startup every time)
COPY --from=builder ${DEPENDENCY_DIR}/${APP_NAME} ${DEPLOY_DIR}/${APP_NAME}

# Override Entrypoint to be able to set needed Java Property for database driver, New Relic agent and deploy exploded WAR as Root (/) context (:)
ENTRYPOINT ["sh", "-c", "java -javaagent:${NEW_RELIC_DIR}/newrelic.jar -Dds.className=${DS_CLASSNAME} -jar /opt/payara/payara-micro.jar --deploy ${DEPLOY_DIR}/${APP_NAME}:"]