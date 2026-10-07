# Logos e imágenes de marca

Aquí van los logos y SVG que tienen **colores propios** que no son tokens: marcas aliadas, medios de pago, redes sociales, ilustraciones.

- Úsalos como archivo: `<img :src="whatsappLogo" alt="WhatsApp" />` con `import whatsappLogo from '@/assets/brand/whatsapp.svg'`.
- Esta carpeta **no** la revisa la guarda de colores (`npm run lint:tokens`). Por eso no se copian aquí componentes ni estilos de la app.
- El logo propio de Maestros a un clic no va aquí: es `BrandMark` (`src/shared/ui`) y usa tokens.
- Íconos de interfaz: siempre `@lucide/vue`, nunca SVG en esta carpeta.

Si de verdad un SVG con colores propios tiene que ir en línea dentro de un componente, usa la excepción documentada en `docs/sistema-de-diseno.md` § 8 (`tokens-ignore` con motivo).
