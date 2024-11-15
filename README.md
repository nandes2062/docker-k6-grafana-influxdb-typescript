# docker-k6-grafana-influxdb-typescript
Demonstrates how to run load tests with containerised instances of K6, Grafana, InfluxDB and Typescript.

## Prerequisites

- **Docker** and **Docker Compose** installed on your system.
- Node.js (for developing TypeScript test scripts).

## Getting Started

### 1. Clone the Repository

```bash
git clone <LINK_REPOSITORY>
cd docker-k6-grafana-influxdb-typescript
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build test
```bash
npm run bundle
```

### 4. Start test
- Example in Terminal Linux / Mac Os:
```bash 
./scripts/get-200-status-test.sh
```
- Example in Powershell Windows:
```bash 
.\scripts\get-200-status-test.ps1
```

### 5. View Report in Grafana
- Open Link:
```bash 
http://localhost:3000/d/k6/k6-load-testing-results
```


