# PocketBase local

La aplicación usa PocketBase para datos, autenticación y archivos. Desde esta carpeta, iniciá el servicio local:

```powershell
.\pocketbase.exe serve
```

Abrí `http://127.0.0.1:8090/_/` y creá el primer superusuario. Las migraciones del directorio `pb_migrations/` se aplican automáticamente al iniciar el servicio. Luego creá un registro en la colección `administrators` con `role` igual a `admin` para acceder al panel de la aplicación.

Copiá `.env.example` como `.env.local` en la raíz si el servicio usa otra URL.
