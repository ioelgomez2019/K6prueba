# Ejercicio 1 - Prueba de carga con k6

## Teoria basica de k6
k6 es una herramienta de pruebas de carga y rendimiento. Los scripts se escriben en JavaScript y simulan usuarios virtuales (VUs) que ejecutan escenarios definidos por etapas (stages). Los resultados se miden con metricas como latencia, tasa de errores y throughput. En este proyecto se prueba un login HTTP, leyendo credenciales desde CSV y validando respuestas con umbrales (thresholds) para detectar fallas y latencias altas.

## Arquitectura del proyecto
- scripts/login_test.js: script principal de prueba.
- data/users.csv: datos de usuarios para login.
- config/config.json: configuracion central (URL, stages, thresholds, ruta de CSV, sleep).
- reports/: salida de reportes (JSON y HTML).
- conclusiones.txt: conclusiones de la ejecucion.

## Requisitos
- Windows 10/11
- k6 v0.49.0
- Node.js (solo si usas k6-reporter)

## Instalacion de k6 (Windows con Winget)
1. Instalar k6:
   ```
   winget install --id Grafana.k6 -e
   ```
2. Verificar version:
   ```
   k6 version
   ```

## Estructura
- scripts/login_test.js
- data/users.csv
- config/config.json
- reports/
- conclusiones.txt

## Ejecucion paso a paso (todo lo necesario)
1. Abrir PowerShell en la carpeta del proyecto.
2. Verificar la instalacion de k6:
   ```
   k6 version
   ```
3. Revisar o ajustar configuracion:
   - config/config.json (URL base, ruta de login, stages, thresholds, CSV, sleep).
4. Verificar que el CSV tenga columnas `user` y `passwd`:
   - data/users.csv
5. Ejecutar la prueba de carga:
   ```
   k6 run scripts/login_test.js
   ```
6. Opcional: sobrescribir URL por variables de entorno:
   ```
   $env:BASE_URL="https://fakestoreapi.com"
   $env:LOGIN_PATH="/auth/login"
   k6 run scripts/login_test.js
   ```
7. Opcional: usar otro archivo de configuracion:
   ```
   $env:CONFIG_PATH="../config/config.json"
   k6 run scripts/login_test.js
   ```
8. Generar reporte JSON (summary export):
   ```
   k6 run --summary-export=reports/summary.json scripts/login_test.js
   ```
9. Revisar el reporte:
   - reports/summary.json

## Reporte HTML
### Opcion A: Dashboard nativo de k6 (recomendada)
1. Ejecutar con export HTML:
   ```
   $env:K6_WEB_DASHBOARD="true"
   $env:K6_WEB_DASHBOARD_EXPORT="reports/report.html"
   k6 run scripts/login_test.js
   ```
2. Abrir el archivo generado:
   - reports/report.html

### Opcion B: HTML desde summary.json (k6-reporter)
1. Instalar el reporter desde GitHub:
   ```
   npm i -g github:benc-uk/k6-reporter
   ```
2. Generar el reporte HTML usando el bin global:
   ```
   $npmBin = npm bin -g
   & "$npmBin\k6-reporter.cmd" reports/summary.json --output reports/report.html
   ```
3. Abrir el archivo generado:
   - reports/report.html

## Notas
- El archivo data/users.csv contiene los parametros user,passwd.
- El script usa ramp-up/down con umbrales de error y latencia.
- Para ajustar la carga, edite las stages en scripts/login_test.js.
## Configuracion
El archivo config/config.json permite controlar:
- URL base y ruta de login.
- stages de carga.
- thresholds.
- ruta del CSV de credenciales.
- tiempo de sleep.
