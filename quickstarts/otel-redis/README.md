# Redis (OpenTelemetry) — DEMO Quickstart

> **DEMO** — This quickstart was created as part of the AFA2026 hackathon (EPIC NR-576657, "OTel Redis Integration"). It is a clone/variant of the existing `redis-otel` quickstart with an expanded dashboard and a complete alert policy.

## What's included

- **Dashboard** (`dashboards/otel-redis`) — 5 panels:
  1. **Throughput** — commands/sec via `rate(sum(redis.commands.processed), 1 second)`
  2. **Latency** — average net I/O latency
  3. **Memory pressure** — `redis.memory.used / redis.maxmemory * 100`
  4. **Connections** — `redis.clients.connected` & blocked clients
  5. **Replication lag** — `redis.replication.backlog_first_byte_offset` deltas
- **Alert policy** (`alert-policies/otel-redis`) — 4 static conditions:
  - High Memory Usage — Warn 75% / Crit 90% / 5min
  - Connection Saturation — Warn 80% / Crit 95% / 3min
  - Replication Lag — Warn 1MB / Crit 10MB / 5min
  - Keyspace Miss Ratio — Warn 50% / Crit 80% / 10min

## Cluster awareness

The dashboard NRQL facets on `redis.cluster.name` when present, allowing you to break down throughput, memory, and replication metrics by cluster. Standalone instances facet by `server.address`.

## Data source

This quickstart uses the `redis-otel` data source. Configure the OpenTelemetry Collector with the [Redis receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/redisreceiver) to ship metrics to New Relic via OTLP.

## DEMO notice

This quickstart is a DEMO clone for hackathon purposes. For the production Redis OpenTelemetry quickstart, use the `redis-otel` slug.
