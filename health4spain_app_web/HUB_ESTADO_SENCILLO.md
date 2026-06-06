# Hub de Colaboradores · Estado del proyecto (en cristiano)

_Última actualización: junio 2026_

## ¿Qué es esto?

Una **app privada interna** (el "Hub") para el equipo que vende seguros en Health4Spain.
No es la web pública: es la **trastienda** donde se gestionan las ventas y, sobre todo,
**las comisiones** (lo que cobra cada comercial).

Entran 4 tipos de personas y cada una ve lo que le toca:

| Rol | Qué ve |
|-----|--------|
| **Admin** (jefe) | Todo |
| **Supervisor** | Su equipo |
| **Técnico** | Las conexiones / la "fontanería" |
| **Closer** (comercial) | Solo lo suyo: sus ventas y su dinero |

---

## ✅ Lo que YA está hecho (terminado y subido)

El problema real: cada mes las aseguradoras (ASISA, etc.) mandan **un Excel gigante**
con todas las comisiones, y había que repartirlo a mano. Eso ya lo hace la app sola:

1. **Subes el archivo** de la aseguradora → la app lo lee, lo limpia y lo entiende.
   Si lo subes dos veces, se da cuenta y no lo duplica.
2. **Repartes cada venta a su comercial** con un par de clics (de uno en uno o en bloque).
3. La app **calcula sola** lo que gana cada uno: su porcentaje, el bonus,
   le resta el IRPF y te dice el **neto** (lo que cobra de verdad).
4. Cada **comercial entra y ve su dinero** en 3 cajones:
   lo que se está cocinando, lo pendiente de cobro y lo ya cobrado.
5. Se puede **sacar un Excel para la gestoría** (para pagar) y un **PDF justificante**
   para cada comercial.

> La base de datos ya está creada en producción y el código está subido a GitHub.

---

## ⏳ Lo que FALTA (una sola cosa, y depende de Claudia)

La app necesita saber, en tiempo real, qué pasa con los clientes potenciales ("leads")
que ya están en el CRM (GoHighLevel). Eso sirve para calcular el **CVR**:

> CVR = *"de cada 10 oportunidades que te doy, ¿cuántas cierras?"* → decide el bonus.

**Buena noticia:** no hay que rehacer la conexión con GHL; reutilizamos la que ya teníamos
de cuando montamos los leads. Todo queda **preparado y "esperando el enchufe"**.

Solo faltan **respuestas de Claudia** (que es quien conoce GHL por dentro):

- [ ] ¿En qué momento se considera una venta "cerrada" dentro de GHL?
- [ ] ¿Qué usuario de GHL es cada comercial nuestro?
- [ ] Activar el "avisador" (webhook) para que GHL avise a la app cuando cambie algo.

Cuando ella conteste, **encender el CVR es pegar 3 datos** por nuestra parte. Nada más.

---

## En una frase

> **Lo gordo (gestionar y pagar comisiones) está hecho y subido.
> Solo queda encender la parte de "rendimiento de cada comercial", y eso depende
> de 3 respuestas de Claudia; el trabajo técnico por nuestro lado ya está listo.**

---

## Presupuesto acordado (recordatorio)

- Hub base: **2.500 €**
- Módulo multi-compañía (los CSV, el reparto, el PDF, el export): **800 €**
- **Total: 3.300 € + IVA**
- Adaptador de compañía adicional: 250 €
- Mantenimiento: 100 €/mes desde el mes 2
