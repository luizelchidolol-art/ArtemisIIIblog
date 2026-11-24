# Atlas espacial · Artemis III

Frontend de divulgación en español, con React, TypeScript y Vite. Requiere Node 22.12 o posterior.

## Abrir localmente

Desde esta carpeta, ejecuta `npm ci` y `npm run dev`. Abre la dirección local que imprime Vite. En PowerShell puedes usar `npm.cmd`.

## Publicar en Vercel

En Windows, extrae el ZIP y abre una terminal en la carpeta que contiene `package.json` y `vercel.json`. Con Node.js 22.12 o posterior instalado, ejecuta:

```powershell
npx.cmd vercel@latest login
npx.cmd vercel@latest --prod
```

En la primera publicación elige tu cuenta, crea un proyecto llamado `atlas-artemis-iii` (o un nombre disponible) y acepta la carpeta actual `./`. El instalador y el comando de compilación están definidos en `vercel.json`. Al finalizar, abre el dominio de producción que aparece en la terminal. Comprueba que se puede entrar al blog, abrir un artículo, actualizar la página y abrir Contacto editorial. Para actualizar la web en el futuro, vuelve a ejecutar el segundo comando desde la misma carpeta.

Importa el repositorio en Vercel y selecciona esta carpeta como Root Directory, con el preset Vite. Usa `npm run build` y la salida `dist`. El archivo vercel.json resuelve las rutas /investigacion y /explorar en accesos directos. Para probar la compilación local usa `npm run build` y `npm run preview`.

El blog se abre en `/blog`. Cada artículo tiene una ruta propia y un enlace al laboratorio. `/investigacion` conserva el acceso desde enlaces antiguos. La infografía se encuentra en `/infografia`, el aviso de uso en `/politicas` y el contacto editorial en `/contacto`. El buzón del proyecto es artemisiiinasaunaq@gmail.com. Las cifras del simulador son educativas. La investigación escolar con los datos de los integrantes se entrega por separado en Word.
