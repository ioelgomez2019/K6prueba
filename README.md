# Ejercicio 1 - Prueba de carga con k6

## Requisitos
- Windows 10/11
- k6 v0.49.0

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
- reports/
- conclusiones.txt

## Ejecucion paso a paso (uno por uno)
1. Abrir PowerShell en la carpeta del proyecto.
2. Verificar la instalacion de k6:
   ```
   k6 version
   ```
3. Ejecutar la prueba de carga:
   ```
   k6 run scripts/login_test.js
   ```
   Opcional: definir variables de entorno para URL:
   ```
   $env:BASE_URL="https://fakestoreapi.com"
   $env:LOGIN_PATH="/auth/login"
   k6 run scripts/login_test.js
   ```
4. Generar reporte JSON (summary export):
   ```
   k6 run --summary-export=reports/summary.json scripts/login_test.js
   ```
5. Revisar el reporte:
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
# K6prueba
