# Configuración del Despliegue Automático

Este proyecto está configurado para desplegar automáticamente a AWS App Runner cuando se realiza un push a la rama `main`.

## Requisitos previos

1. Una cuenta de AWS con acceso a:
   - Amazon ECR (Elastic Container Registry)
   - AWS App Runner
   - IAM (para crear/gestionar roles)

2. Repositorio de ECR creado: `short-link-guardian-front`

## Configuración de Secrets en GitHub

Para que el workflow funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" > "Secrets and variables" > "Actions"
3. Agrega los siguientes secrets:

| Nombre del Secret | Descripción |
|-------------------|-------------|
| `AWS_ACCESS_KEY_ID` | ID de clave de acceso de AWS con permisos para ECR y App Runner |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta de acceso de AWS correspondiente |
| `APPRUNNER_SERVICE_ROLE_ARN` | ARN del rol de servicio de App Runner (ej: `arn:aws:iam::157422757090:role/AppRunnerECRAccessRole`) |

## Creación del Rol de Servicio para App Runner

Para crear el rol de servicio necesario para App Runner:

1. Ve a la consola de AWS IAM
2. Crea un nuevo rol
3. Selecciona "App Runner" como entidad de confianza
4. Agrega la política `AmazonECR-ReadOnly` al rol
5. Dale un nombre al rol (ej: `AppRunnerECRAccessRole`)
6. Copia el ARN del rol creado y guárdalo como secret `APPRUNNER_SERVICE_ROLE_ARN` en GitHub

## Personalización del Workflow

Si necesitas personalizar el workflow:

1. Modifica el archivo `.github/workflows/deploy.yml`
2. Puedes ajustar configuraciones como:
   - Región de AWS
   - Nombre del repositorio ECR
   - Recursos asignados a la aplicación (CPU, memoria)
   - Puerto de la aplicación

## Verificación del Despliegue

Después de un push a `main`:

1. Ve a la pestaña "Actions" de tu repositorio para ver el progreso del workflow
2. Una vez completado, podrás ver la URL de la aplicación desplegada en la salida del último paso
3. También puedes verificar el estado en la consola de AWS App Runner
