# Realtime Chat

Realtime Chat es un chat en tiempo real que permite a los usuarios interactuar en tiempo real con otros usuarios en línea. El chat se basa en la tecnología de Supabase configurada con Realtime y Next.js.

## Instalación y configuración

Para instalar Realtime Chat, sigue los siguientes pasos:

1. Clona el repositorio del proyecto.

```bash
git clone https://github.com/Xiza73/realtime-chat
```

2. Instala las dependencias del proyecto.

```bash
npm install
```

3. Crea una copia de seguridad de la base de datos de Supabase.

```bash
supabase db push
```

4. Copia el archivo `.env.example` a `.env.local` y agrega las credenciales requeridas para la conexión a Supabase.

5. Inicia el servidor de desarrollo.

```bash
npm run dev
```

## Tecnologías utilizadas

Realtime Chat utiliza las siguientes tecnologías:

- **Supabase**: Una plataforma de base de datos de código abierto que permite a los desarrolladores crear, administrar y administrar bases de datos de forma fácil.
- **Next.js**: Una plataforma de desarrollo web de código abierto que permite a los desarrolladores crear aplicaciones web rápidas y fáciles de mantener.
- **Tailwind CSS**: Una biblioteca de estilos CSS que permite a los desarrolladores crear diseños de sitio web personalizados y atractivos, sobre Tailwind CSS estamos utilizando Shadcn para usar componentes pre-fabricados.
- **Realtime**: Una tecnología de Supabase que permite a los desarrolladores crear aplicaciones web en tiempo real y real-time.

## Decisiones técnicas relevantes

Realtime Chat utiliza las siguientes decisiones técnicas:

- **Utilización de Next.js**: Al proporcionar una estructura de aplicación web rápida y fácil de mantener, fue esencial para el desarrollo de la prueba técnica.
- **Utilización de Shacdn**: Nos permite utilizar componentes pre-fabricados que además son fáciles de personalizar con Tailwind CSS.
- **Utilización de Realtime**: Una primera opción fue WebSockets, pero aprovechamos el uso de Supabase para no depender de una API externa.
