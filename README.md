# ChausSec Frontend - Clean Implementation

A clean, production-ready React frontend for the ChausSec SOC platform.

## Structure

```
ChausSecFrontendNew/
├── src/
│   ├── api/           # API client functions
│   ├── components/    # Reusable React components
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   ├── types/         # TypeScript interfaces
│   ├── App.tsx        # Main app with routes
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── Dockerfile         # Production build
├── nginx.conf        # Nginx proxy configuration
├── package.json
├── tsconfig.json
└── vite.config.ts    # Development proxy config
```

## Key Fixes from Original

1. **nginx.conf**: Fixed proxy paths to correctly route to `chaussec-api:5050/chaussec/`
2. **Added all required proxy headers**: Content-Type, Content-Length, X-Forwarded-Proto
3. **Simplified proxy configuration**: Direct proxy_pass without duplicate paths

## Development

```bash
# Install dependencies
npm install

# Run dev server (port 4173)
npm run dev
```

The dev server proxies `/chaussec/` to `http://localhost:5050/chaussec`

## Production with Docker

```bash
# Build the image
docker build -t chaussec-frontend .

# Or use docker-compose from ChausSecAPI repo
cd /path/to/ChausSecAPI
docker-compose up -d
```

## Docker Compose Integration

In your `docker-compose.yml` (ChausSecAPI repo):

```yaml
chaussec-frontend:
  build: ../ChausSecFrontendNew  # or image: scxrrow/chaussecui:latest
  container_name: chaussec-frontend
  ports:
    - "4173:80"
  depends_on:
    - chaussec-api
  networks:
    - chaussec_net
```

## nginx Configuration

The nginx config proxies:
- `/chaussec/*` → `http://chaussec-api:5050/chaussec/*`
- `/docker/*` → `http://chaussec-api:5050/docker/*`
- `/requin/*` → `http://chaussec-api:5050/requin/*`
- `/opensearch/*` → `http://opensearch:9200/*`

All with proper headers for Docker internal networking.

## Authentication Flow

1. User submits credentials at `/login`
2. Frontend POSTs to `/chaussec/cki/login`
3. nginx proxies to `http://chaussec-api:5050/chaussec/cki/login`
4. Backend returns JWT token
5. Frontend stores `Bearer <token>` in localStorage
6. Subsequent requests include Authorization header

## Routes

- `/login` - Login page (public)
- `/` - Dashboard (protected)
- `/alerts` - Suricata alerts (protected)
- `/history` - Scan history (protected)
- `/nmap` - Nmap scanner (protected)
