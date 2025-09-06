import os

BASE_URL = "https://zotexd.github.io/pruebaPAG.github.io"

for root, dirs, files in os.walk("."):
    for file in files:
        if file == "inicio.md":
            ruta = os.path.join(root, file)
            ruta = ruta.lstrip("./").replace("\\", "/")  # Normalizar ruta
            ruta = ruta[:-3]  # quitar .md
            print(f"{BASE_URL}/{ruta}")
