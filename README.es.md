# 42 Reset — Guía en español

[Inicio](README.md) · [Français](README.fr.md) · [English](README.en.md) · **Español**

**Versión 1.1.1 — Extensión para Brave y Google Chrome de escritorio.**

42 Reset borra con un clic las cookies, la caché y el almacenamiento local de la Intra de 42, y después vuelve a cargar las pestañas afectadas que ya estaban abiertas. Su icono es un **cuadrado negro con un «42» blanco**. Durante la limpieza, un **círculo blanco gira dentro del icono**, sin ventanas emergentes ni ventanas nuevas.

## El problema que dio origen al proyecto

La extensión se creó para un problema recurrente: el perfil en `https://profile.intra.42.fr/` deja de ser accesible y es necesario borrar los datos del sitio en el navegador antes de volver a intentarlo.

Las cookies de inicio de sesión caducadas, los recursos guardados en caché o un almacenamiento local que ya no coincide con una actualización del sitio pueden contribuir a este tipo de fallo. **No se ha diagnosticado la causa exacta del problema original.**

42 Reset automatiza el procedimiento de limpieza. En lugar de buscar los datos de los dos sitios en los ajustes del navegador cada vez que ocurre el problema, solo tienes que pulsar un icono.

## Qué puede resolver la extensión

Puede ayudar cuando los problemas de acceso a la Intra o al perfil se deben a datos guardados localmente en el navegador. Restablece los datos locales de los dos sitios y vuelve a cargar sus páginas para que puedan empezar con datos nuevos.

No repara una caída de los servidores de 42, un problema de red o DNS, un acceso denegado por 42 ni un problema específico de la cuenta. Si la limpieza termina correctamente pero el perfil sigue sin abrirse, la causa puede estar en otro lugar. Tampoco garantiza que el problema no vuelva a aparecer.

## Compatibilidad

La extensión utiliza Manifest V3 y las API estándar de Chrome. Su código en el navegador no depende de ningún programa específico de Linux, Windows o macOS.

| Navegador | Linux | Windows | macOS |
| --- | --- | --- | --- |
| Brave de escritorio | Probado en un perfil temporal | Compatibilidad prevista; sin probar directamente | Compatibilidad prevista; sin probar directamente |
| Google Chrome de escritorio | Compatibilidad prevista; sin probar directamente | Compatibilidad prevista; sin probar directamente | Compatibilidad prevista; sin probar directamente |

Requisitos:

- Google Chrome **132 o posterior**, o una versión de Brave basada en **Chromium 132 o posterior**.
- Un sistema operativo compatible con la versión del navegador que utilices.
- Posibilidad de cargar una extensión local en modo de desarrollador. Un navegador administrado por un centro educativo o una empresa puede bloquear esta instalación.

El mismo archivo ZIP está previsto para los tres sistemas, sin necesidad de compilar. **No necesitas Node.js ni Python para instalar o utilizar la extensión.** Este paquete no está dirigido a Safari, Firefox ni navegadores móviles.

Google explica cómo [cargar extensiones locales en Windows, Mac y Linux](https://support.google.com/chrome/a/answer/2714278?hl=es), y Brave utiliza el [sistema de extensiones de Chrome](https://brave.com/learn/using-chrome-extensions-in-brave/). La compatibilidad prevista se deduce de estos mecanismos y del código; no sustituye una prueba en cada plataforma.

## Instalación

### 1. Preparar la carpeta

Si has recibido `42-reset-brave.zip`, descomprímelo primero. Aunque el nombre del ZIP menciona Brave, su contenido también está previsto para Chrome.

Guarda la carpeta extraída `42-reset` en una ubicación permanente del ordenador. Si utilizas directamente el código fuente del proyecto, selecciona la carpeta del proyecto.

La carpeta que debes cargar tiene que contener directamente `manifest.json`, `background.js`, `cleaner.js`, `toolbar.js` y la carpeta `icons`. Selecciona **esa carpeta**, no el archivo ZIP ni su carpeta superior. No la muevas ni la borres después de instalar la extensión: el navegador utiliza sus archivos.

### 2. Cargar la extensión

1. Abre el navegador y el perfil en el que utilizas la Intra.
2. Escribe la dirección correspondiente en la barra de direcciones:

   | Navegador | Dirección |
   | --- | --- |
   | Brave | `brave://extensions` |
   | Google Chrome | `chrome://extensions` |

3. Activa **Modo de desarrollador**, normalmente en la esquina superior derecha.
4. Pulsa **Cargar descomprimida**. El nombre puede variar según el idioma o la versión; en inglés aparece como **Load unpacked**.
5. Selecciona la carpeta que contiene `manifest.json` y confirma.
6. Comprueba que **42 Reset — Débloquer l’Intra** aparece en la lista y está activada.

Los pasos son los mismos en Linux, Windows y macOS; solo cambia el selector de carpetas. Es una instalación local: la extensión no está publicada en Chrome Web Store.

### 3. Fijar el icono

Abre el menú de extensiones, normalmente representado por una pieza de puzle junto a la barra de direcciones, y fija **42 Reset**. El cuadrado negro con el **42 blanco** quedará accesible desde la barra de herramientas.

**Instalar o volver a cargar la extensión no inicia ninguna limpieza. Tienes que pulsar su icono.**

## Uso habitual

1. Guarda cualquier texto o trabajo que estés editando en las páginas de la Intra: se volverán a cargar.
2. Cuando tu perfil deje de abrirse o quieras restablecer los datos locales, pulsa el icono 42 **una sola vez**.
3. Un círculo blanco gira sobre el cuadrado negro durante la limpieza. La operación no crea ventanas emergentes, ventanas nuevas ni pestañas nuevas.
4. Las pestañas que ya estaban abiertas en los dos sitios muestran brevemente una página de espera en su propia pestaña y después recuperan su dirección original.
5. Cuando vuelva el 42 blanco, coloca el cursor sobre el icono para leer el resultado. Inicia sesión de nuevo en 42 si el sitio lo solicita.

La limpieza puede tardar varios segundos. Los clics adicionales durante una operación en curso no inician limpiezas simultáneas.

También puedes pulsar el icono desde otro sitio o cuando no haya ninguna pestaña de la Intra abierta. La limpieza se ejecutará igualmente; después tendrás que abrir tú mismo [la Intra](https://intra.42.fr/) o [tu perfil](https://profile.intra.42.fr/). La extensión no abre automáticamente el perfil en una pestaña nueva.

### Cómo interpretar los indicadores

| Indicador | Significado | Qué hacer |
| --- | --- | --- |
| Cuadrado negro con 42 blanco | Extensión en reposo u operación terminada | Colocar el cursor sobre el icono para leer su estado |
| Círculo blanco girando | Limpieza en curso | Esperar a que termine |
| Pequeña insignia `!`, blanca sobre negro | Limpieza incompleta o interrumpida | Leer el mensaje al pasar el cursor y pulsar para reintentar |

Los mensajes de la extensión y la página de espera están actualmente en francés. Los tres idiomas corresponden a esta documentación.

## Datos que se borran y alcance

Los orígenes incluidos son `https://intra.42.fr`, `https://profile.intra.42.fr` y sus equivalentes HTTP en los puertos estándar. El almacenamiento de otros subdominios no se incluye automáticamente.

| Datos | Tratamiento |
| --- | --- |
| Cookies utilizables por los dos hosts | Eliminación selectiva, incluidas las cookies HttpOnly, particionadas y asociadas a distintas rutas |
| Cookies compartidas de `.intra.42.fr` y `.42.fr` | Se eliminan cuando se aplican a alguno de los dos hosts |
| Caché HTTP y Cache Storage | Se borran para los orígenes incluidos |
| localStorage e IndexedDB | Se borran para los orígenes incluidos |
| Sistemas de archivos del sitio y service workers | Se borran para los orígenes incluidos; también se solicita borrar WebSQL si el navegador todavía lo admite |
| sessionStorage | Se vacía en los documentos accesibles de las pestañas de la Intra abiertas al pulsar el icono |

**Las cookies compartidas de `.42.fr` pueden utilizarse en varios servicios, por lo que eliminarlas también puede cerrar tu sesión en otros servicios de 42.** Se conservan las cookies propias de otro host, como `other.42.fr`. Las cookies se eliminan individualmente para evitar un borrado general de todas las cookies del dominio.

No se garantiza la limpieza del almacenamiento de sesión de pestañas ya cerradas o descartadas por el navegador, ni de iframes de la Intra integrados en otros sitios. Una página o un documento inaccesible puede provocar un resultado parcial.

La limpieza solo se aplica al **perfil del navegador donde está instalada la extensión**, fuera de la navegación privada o de incógnito. No limpia otros perfiles, otros navegadores ni otros dispositivos.

## Efectos que debes conocer

- Las páginas de la Intra se vuelven a cargar: puedes perder los datos que no hayas guardado.
- Puede ser necesario iniciar sesión de nuevo. Algunas preferencias o datos sin conexión del sitio pueden borrarse.
- Se conservan las contraseñas guardadas en el gestor del navegador, el historial, los marcadores, los archivos descargados y los permisos de los sitios.
- La extensión no elimina tu cuenta, tus proyectos ni tu progreso en los servidores de 42.
- Los sitios pueden volver a crear cookies y caché después de la limpieza. Que reaparezcan no significa que la operación haya fallado.
- La extensión no tiene una función para deshacer el borrado de los datos locales.

## Solución de problemas

| Situación | Qué hacer |
| --- | --- |
| No aparece el botón para cargar la extensión | Comprobar el modo de desarrollador. Si el navegador está administrado, preguntar al administrador si se permiten extensiones locales. |
| El navegador no encuentra el manifiesto | Descomprimir el ZIP y seleccionar la carpeta que contiene directamente `manifest.json`. |
| El icono no aparece en la barra | Comprobar que la extensión está activada y fijarla desde el menú de extensiones. |
| Aparece la insignia `!` | Leer el detalle al pasar el cursor, cerrar otras páginas de 42 si se están recreando cookies y volver a intentarlo. |
| El círculo o la página de espera no desaparecen | Esperar un poco. Si la operación parece bloqueada, volver a cargar la extensión desde la página de extensiones, reintentar y abrir el perfil manualmente si hace falta. |
| El sitio solicita iniciar sesión | Es un efecto esperado de borrar las cookies de sesión. Iniciar sesión normalmente. |
| La limpieza termina correctamente pero el perfil sigue inaccesible | Comprobar el acceso al sitio y la red; un incidente del servicio o de la cuenta puede requerir ayuda del soporte de 42. |
| El problema vuelve más adelante | Ejecutar de nuevo la limpieza. La extensión automatiza un restablecimiento local sin corregir definitivamente la causa del fallo. |

## Actualización y desinstalación

Para actualizar:

1. Sustituye los archivos de la carpeta instalada por los de la nueva versión, manteniendo la misma ubicación.
2. Abre `brave://extensions` o `chrome://extensions`.
3. Pulsa **Volver a cargar** en la tarjeta de 42 Reset. El botón puede aparecer como **Reload** según el idioma. Volver a cargar la extensión no borra por sí solo los datos de los sitios.

Para desactivarla temporalmente, utiliza su interruptor en esa misma página. Para desinstalarla, pulsa **Quitar** o **Eliminar**, según el navegador, y confirma. Después puedes borrar su carpeta si ya no la necesitas. La desinstalación no recupera los datos que ya se hayan borrado.

## Privacidad y permisos

No hay que crear una cuenta y no se utiliza telemetría, servidor de recopilación ni biblioteca remota. El código no registra ni conserva los valores de las cookies. El progreso y el resultado de la última limpieza se guardan en memoria mediante `chrome.storage.session` hasta que termina la sesión del navegador.

Al volver a cargar las páginas, estas realizan sus solicitudes habituales a 42, igual que durante una navegación normal.

| Permiso | Uso en esta extensión |
| --- | --- |
| `cookies` | Buscar y eliminar las cookies incluidas en el alcance |
| `browsingData` | Borrar caché y almacenamiento con una lista fija de orígenes; el permiso es técnicamente amplio, pero el código no realiza una limpieza global |
| `scripting` | Vaciar el almacenamiento de sesión de las páginas accesibles de la Intra |
| `storage` | Conservar en memoria el progreso y el resultado |
| Acceso a `intra.42.fr` y `profile.intra.42.fr` | Actuar sobre los dos hosts sin solicitar acceso a todos los sitios |

## Para desarrolladores

La carpeta completa del código fuente incluye scripts y pruebas; el archivo de instalación contiene únicamente la extensión y su documentación.

Con Node.js, npm y Python 3 disponibles, ejecuta desde la carpeta del código fuente:

```sh
npm test
npm run pack
```

El primer comando ejecuta las pruebas de lógica. El segundo genera `dist/42-reset-brave.zip`, que puede utilizarse en Brave o Chrome después de extraerlo. Estos comandos no requieren ejecutar `npm install`.

La prueba de integración opcional `scripts/test-browser.mjs` necesita Playwright y un navegador instalado. Utiliza un perfil temporal y respuestas de sitios simuladas, sin modificar el perfil personal. Las variables de entorno `PLAYWRIGHT_MODULE` y `BROWSER_EXECUTABLE` permiten indicar sus rutas. Se ha verificado el funcionamiento en Brave sobre Linux: limpieza de almacenamiento y cookies, conservación de datos de otros sitios, recarga de las pestañas existentes y animación sin ventanas emergentes ni pestañas nuevas. Esto no constituye un diagnóstico del sitio real.

El script opcional `scripts/generate-icons.py` necesita Pillow. Su ruta de fuente predeterminada corresponde a Linux y debe adaptarse en otro sistema para regenerar los iconos. Los archivos PNG incluidos funcionan sin este script.

## Referencias

- [Cargar una extensión local en Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Versión mínima de Chrome en el manifiesto](https://developer.chrome.com/docs/extensions/reference/manifest/minimum-chrome-version)
- [API browsingData](https://developer.chrome.com/docs/extensions/reference/api/browsingData)
- [API cookies](https://developer.chrome.com/docs/extensions/reference/api/cookies)
- [API action: icono y botón de la barra de herramientas](https://developer.chrome.com/docs/extensions/reference/api/action)
