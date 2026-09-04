# Imagen oficial de Puppeteer: ya incluye Node, Chromium y todas las
# librerías del sistema necesarias para que el navegador headless funcione.
# Usamos la misma versión que tenés en package.json (puppeteer ^25.1.0)
# para evitar mismatches entre la lib y el Chromium empaquetado.
FROM ghcr.io/puppeteer/puppeteer:25.1.0

# La imagen ya trae un usuario no-root "pptruser" configurado (no hace
# falta crearlo nosotros). Trabajamos dentro de su home.
WORKDIR /home/pptruser/app

# Copiamos solo los manifiestos primero para aprovechar el cache de capas:
# si no cambian las dependencias, Docker no vuelve a correr npm ci.
COPY --chown=pptruser:pptruser package*.json ./

# Instalamos únicamente dependencias de producción.
# Puppeteer no vuelve a descargar Chromium: la imagen ya lo trae y viene
# configurado vía PUPPETEER_EXECUTABLE_PATH internamente.
RUN npm ci --omit=dev

# Copiamos el resto del código fuente (ver .dockerignore para lo excluido)
COPY --chown=pptruser:pptruser . .

ENV NODE_ENV=production

# Ajustá este puerto si tu app.js escucha en otro
EXPOSE 3000

# Usamos el script que ya tenés en package.json en vez de hardcodear la ruta
CMD ["npm", "start"]