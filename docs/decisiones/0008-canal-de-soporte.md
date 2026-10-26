# 0008. Canal de soporte de pedidos
Estado: Aceptada (2026-10-25)

## Contexto
Hoy cada pedido tiene chat (Stream Chat) y videollamada (Stream Video) con soporte. Son la parte más pesada del bundle (~2.6 MB en total), requieren cuenta en Stream y suman otra API de terceros. Stream tiene un plan gratuito para negocios pequeños, pero con condiciones (verificar en getstream.io).

## Decisión
1. **Quitar Stream Video**: una tienda de tecnología rara vez necesita videollamadas por pedido.
2. **Reemplazar Stream Chat por WhatsApp**: botón "Escríbenos por WhatsApp" en el detalle del pedido, que abre `https://wa.me/NUMERO?text=...` con el número del pedido ya escrito. En Colombia es el canal que los clientes esperan, cuesta cero y no requiere API.

## Alternativas
- Mantener Stream Chat y quitar solo Video: conserva el historial dentro de la tienda, pero sigue la dependencia y el peso.
- Mantener ambos: la opción más costosa en complejidad.

## Consecuencias
- Se eliminan `stream-chat`, `stream-chat-react`, `@stream-io/video-react-sdk`, `streamController`, `lib/stream.ts`, las páginas de chat y video y las variables `STREAM_*`.
- Variable pública nueva: `VITE_WHATSAPP_NUMBER`.
- El rol `support` pierde su función actual; se puede conservar para ver pedidos en el admin.
