# Archivos a Eliminar Manualmente

Los siguientes archivos/carpetas son obsoletos y pueden eliminarse:

```
health4spain_partners_strategy.txt    # Contenido en docs/MODELO_NEGOCIO.md
messages/                             # Carpeta de pruebas
pruebas_html/                         # Carpeta de pruebas HTML
supabase/storage-buckets.sql          # Consolidado en storage-policies.sql
docs/MODELO_PARTNERS_LEADS.md         # Duplicado de MODELO_NEGOCIO.md
```

## Comando para eliminar (Windows PowerShell):

```powershell
Remove-Item -Path "health4spain_partners_strategy.txt" -Force
Remove-Item -Path "messages" -Recurse -Force
Remove-Item -Path "pruebas_html" -Recurse -Force
Remove-Item -Path "supabase\storage-buckets.sql" -Force
Remove-Item -Path "docs\MODELO_PARTNERS_LEADS.md" -Force
```

## Comando para eliminar (Git Bash / Linux):

```bash
rm health4spain_partners_strategy.txt
rm -rf messages/
rm -rf pruebas_html/
rm supabase/storage-buckets.sql
rm docs/MODELO_PARTNERS_LEADS.md
```

---

*Este archivo también puede eliminarse después de limpiar.*
