### Backend (Monorepo)

```bash
npm install
```

### Frontend (Angular)

```bash
cd client
npm install
```

### Docker

```bash
docker-compose up -d
```

### Terminal 1: API Gateway

```bash
cd apps/api-gateway
npm run start:dev
```

Port: http://localhost:3000

### Terminal 2: Auth Service

```bash
cd apps/auth-service
npm run start:dev
```

Port: http://localhost:3001

### Terminal 3: Portfolio Service

```bash
cd apps/portfolio-service
npm run start:dev
```

Port: http://localhost:3002

### Terminal 4: Logs Service

```bash
cd apps/logs-service
npm run start:dev
```

Port: http://localhost:3003

### Terminal 5: Angular Client

```bash
cd client
ng serve
```

Port: http://localhost:4200
