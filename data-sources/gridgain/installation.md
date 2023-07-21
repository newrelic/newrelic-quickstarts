# Exporting GridGain metrics and logs to New Relic

_I know this is not the correct place. I just wanted to document it somewhere._

1. Download the OpenTelemetry Java agent
2. Configure GridGain to use the agent
3. Configure the agent
4. Add the cluster to your New Relic dashboard


## Download OpenTelemetry

Get a copy of the latest [OpenTelemetry Java agent](https://github.com/open-telemetry/opentelemetry-java-instrumentation).

## Configure GridGain to use the agent.

For your server, you'll likely set the necessary parameters in your `JVM_OPTS`. For example:

```
-Xmx5g -XX:+UseG1GC -DIGNITE_QUIET=false
-Djava.net.preferIPv4Stack=true
-javaagent:$AGENT_PATH/opentelemetry-javaagent.jar
-Dotel.exporter.otlp.endpoint=$NEW_RELIC_ENDPOINT
-Dotel.exporter.otlp.headers=api-key=$NEW_RELIC_API
-Dotel.service.name=GridGain-OpenTelemetry
-Dotel.jmx.config=$NEW_RELIC_CONFIG/gridgain-newrelic.yaml
```

To identify your GridGain nodes in New Relic, you should name them. It's recommended
to use the consistent ID:

```
export OTEL_RESOURCE_ATTRIBUTES=service.instance.id=gridgain-node-1
```

If you'd like to collect logs in New Relic, you should also set the following:

```
export OTEL_EXPORTER_OTLP_COMPRESSION=gzip
export OTEL_LOGS_EXPORTER=otlp
```

## Configure the agent

You also need to configure the agent to map GridGain's metrics to something that can 
be understood by New Relic. This is the file referenced above as gridgain-newrelic.yaml.

A sample can be found [here](gridgain-newrelic.yaml)

## Add the cluster to New Relic

Blah.