---
name: deployment-kubernetes-quick
description: "Kubernetes deployment basics. Use when asking 'kubernetes deployment', 'k8s finance-app', or 'kubernetes setup'."
---

# Kubernetes Deployment Quick Start

> **Skill Metadata**
> Category: `deployment`
> Priority: `LOW`
> SDK Version: `0.9.25+`

## Kubernetes Manifests

### Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: finance-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: finance-app
  template:
    metadata:
      labels:
        app: finance-app
    spec:
      containers:
      - name: app
        image: my-finance-app:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: finance-app-secrets
              key: openai-api-key
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: finance-app-config
              key: database-url
        - name: RUNTIME_TYPE
          value: "async"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: finance-app
spec:
  type: LoadBalancer
  selector:
    app: finance-app
  ports:
  - port: 80
    targetPort: 8000
```

### ConfigMap
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: finance-app-config
data:
  database-url: postgresql://user@db:5432/mydb
```

### Secret

> **Production note**: Prefer creating secrets imperatively with `kubectl create secret generic`
> instead of committing base64-encoded values in YAML manifests. For production, use a secrets
> manager (Vault, AWS Secrets Manager, etc.).

```bash
# Preferred: create secret from literal values (never commit this command to git)
kubectl create secret generic finance-app-secrets \
  --from-literal=openai-api-key="$OPENAI_API_KEY"
```

```yaml
# secret.yaml — alternative declarative approach (base64-encoded)
apiVersion: v1
kind: Secret
metadata:
  name: finance-app-secrets
type: Opaque
data:
  # echo -n "$OPENAI_API_KEY" | base64
  openai-api-key: <base64-encoded-key>
```

## Deployment Commands

```bash
# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/finance-app

# Scale replicas
kubectl scale deployment finance-app --replicas=5
```

## Python Framework Notes

- **AsyncLocalRuntime required**: All Python containers must set `RUNTIME_TYPE=async` for proper async workflow execution in containerized environments.
- **FastAPI health endpoint**: If your app uses FastAPI, the built-in `/health` endpoint is automatically available for liveness/readiness probes — no custom health check code needed.

## Best Practices

1. **Health checks** - Liveness and readiness probes (use FastAPI built-in `/health` if available)
2. **Resource limits** - Set memory/CPU limits
3. **Secrets** - Use `kubectl create secret generic --from-literal` or a secrets manager (never commit base64-encoded secrets to git)
4. **ConfigMaps** - For configuration
5. **Horizontal scaling** - Multiple replicas
6. **Rolling updates** - Zero-downtime deployments

<!-- Trigger Keywords: kubernetes deployment, k8s finance-app, kubernetes setup, k8s workflows -->
