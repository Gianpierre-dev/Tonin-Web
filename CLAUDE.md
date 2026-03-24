# Tonin-Api - Backend

## Descripcion
API REST de frases motivacionales por estado de animo con musica e imagenes almacenadas en Wasabi S3.

## Stack
- Java 21 + Spring Boot 3.4.3
- PostgreSQL 17
- Spring Security + JWT (stateless)
- Wasabi S3 (storage de archivos)
- Swagger/OpenAPI en /swagger-ui.html

## Arquitectura
```
controller/ → Endpoints REST (@Valid, Request DTOs, inyeccion por constructor)
service/    → Logica de negocio (interfaces + implementaciones)
repository/ → JPA repositories
model/      → Entidades JPA (Usuario, Rol, EstadoAnimo, Frase)
dto/        → Request records (FraseRequest, EstadoAnimoRequest, RegisterRequest, LoginRequest)
             Response records (FraseDTO, EstadoAnimoDTO, AuthResponse, UploadResponse)
exception/  → ResourceNotFoundException (404), BadRequestException (400), GlobalExceptionHandler
config/     → SecurityConfig, JwtAuthenticationFilter, WasabiConfig
```

## Endpoints

### Publicos
- POST /api/auth/register → Registrar usuario (1er usuario = ADMIN automatico)
- POST /api/auth/login → Login, retorna { token: "jwt..." }
- GET /api/frases/random?animo={nombre}&excluidos={ids} → Frase aleatoria por estado de animo
- GET /api/estados → Listar todos los estados de animo

### Protegidos (ADMIN + JWT en header Authorization: Bearer {token})
- CRUD /api/frases → body: { texto, estadoAnimoId }
- CRUD /api/estados → body: { nombre, emoji, musicaUrl, imagenUrl }
- POST /api/uploads/imagen → multipart/form-data, campo "file"
- POST /api/uploads/musica → multipart/form-data, campo "file"
- DELETE /api/uploads?url={url} → Eliminar archivo de Wasabi

## DTOs de respuesta

### FraseDTO
```json
{ "id": 1, "texto": "frase", "estadoAnimo": { "id": 1, "nombre": "FELIZ", "emoji": "😊", "musicaUrl": "url", "imagenUrl": "url" } }
```

### EstadoAnimoDTO
```json
{ "id": 1, "nombre": "FELIZ", "emoji": "😊", "musicaUrl": "url", "imagenUrl": "url" }
```

### AuthResponse
```json
{ "token": "eyJhbGciOiJIUzI1..." }
```

### UploadResponse
```json
{ "url": "https://s3.../archivo.png", "tipo": "imagen" }
```

## Base URL
http://localhost:8080

## Repo frontend
Tonin-Web (Astro + React) - repo separado que consume esta API.

## Convenciones
- Commits en español
- No incluir referencias a Claude Code en commits ni codigo
- Inyeccion por constructor (no @Autowired en campo)
- Request DTOs separados de Response DTOs
- Excepciones custom con codigos HTTP correctos
