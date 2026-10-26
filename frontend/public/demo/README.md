# Fotos provisionales (solo desarrollo)

Fotos de [Unsplash](https://unsplash.com) bajo la [licencia de Unsplash](https://unsplash.com/license) (uso libre, sin atribución obligatoria). Se usan para que el inicio, las categorías y el seed se vean con fotos reales mientras no existan las del catálogo propio.

**Antes de producción (F8) se reemplazan por fotos propias subidas a ImageKit.** Varias muestran marcas (Apple, Samsung, JBL): no deben quedar en la tienda publicada.

| Archivo              | Foto original                                  |
| -------------------- | ---------------------------------------------- |
| phone-light.jpg      | unsplash.com/photos/1511707171634-5f897ff02aa9 |
| watch-white.jpg      | 1546868871-7041f2a55e12                        |
| headphones-white.jpg | 1583394838336-acd977736f90                     |
| tv-light.jpg         | 1593784991095-a205069470b6                     |
| phone-android.jpg    | 1598327105666-5b89351aff97                     |
| phone-black.jpg      | 1601784551446-20c9e07cdbdb                     |
| iphone-back.jpg      | 1592750475338-74b7b21085ab                     |
| galaxy-dark.jpg      | 1610945265064-0e34e5519bbf                     |
| watch-white2.jpg     | 1523275335684-37898b6baf30                     |
| watch-gray.jpg       | 1579586337278-3befd40fd17a                     |
| earbuds-white.jpg    | 1572569511254-d8f925fe2cbb                     |
| earbuds-lavender.jpg | 1590658268037-6bf12165a8df                     |
| speaker-jbl.jpg      | 1608043152269-423dbba4e7e1                     |
| headphones-warm.jpg  | 1484704849700-f032a568e944                     |
| tv-dark.jpg          | 1593359677879-a4bb92f829d1                     |
| charger.jpg          | 1583863788434-e58a36330cf0                     |
| earbuds-red.jpg      | 1606220588913-b3aacb4d2f46                     |
| speaker-dark.jpg     | 1545454675-3531b543be5d                        |
| gym.jpg              | 1571019613454-1cb2f99b2d8b                     |

## Wikimedia Commons

Fotos de cámaras de seguridad y accesorios (2026-10-25), de [Wikimedia Commons](https://commons.wikimedia.org). Se usan
redimensionadas a 1200 px. Las CC BY y CC BY-SA **exigen atribución** (autor, licencia y enlace, como en esta tabla);
las CC BY-SA además piden compartir con la misma licencia cualquier versión modificada. Igual que las de Unsplash, son
provisionales y se reemplazan por fotos propias en F8. `security-wifi.jpg` muestra una marca pequeña (Lorex).

| Archivo | Original | Autor | Licencia |
| --- | --- | --- | --- |
| security-bullet.jpg | [CCTV camera in Poland (1).jpg](https://commons.wikimedia.org/wiki/File:CCTV_camera_in_Poland_(1).jpg) | MichalPL | CC BY-SA 4.0 |
| security-dome-dark.jpg | [CP Plus CCTV camera.jpg](https://commons.wikimedia.org/wiki/File:CP_Plus_CCTV_camera.jpg) | sharky1005 | CC BY-SA 4.0 |
| security-pole.jpg | [Security camera, September 2018.jpg](https://commons.wikimedia.org/wiki/File:Security_camera,_September_2018.jpg) | Cody Logan | CC BY-SA 4.0 |
| security-outdoor.jpg | [Security camera around Ebisu Garden Place.jpg](https://commons.wikimedia.org/wiki/File:Security_camera_around_Ebisu_Garden_Place.jpg) | Syced | CC0 |
| security-wifi.jpg | [Lorex easy connect ip camera.jpg](https://commons.wikimedia.org/wiki/File:Lorex_easy_connect_ip_camera.jpg) | Kingrattus (Wikipedia en inglés) | Public domain |
| security-ptz.jpg | [Outdoor wireless security camera at Nuthurst, Sussex 1.jpg](https://commons.wikimedia.org/wiki/File:Outdoor_wireless_security_camera_at_Nuthurst,_Sussex_1.jpg) | Acabashi | CC BY-SA 4.0 |
| tv-box.jpg | [Android TV.jpg](https://commons.wikimedia.org/wiki/File:Android_TV.jpg) | Justin Ormont | CC BY-SA 3.0 |
| microsd.jpg | [MicroSD card between two fingers.jpg](https://commons.wikimedia.org/wiki/File:MicroSD_card_between_two_fingers.jpg) | Ivan Radic | CC BY 2.0 |
| hdd-external.jpg | [Toshiba 1 TB External USB Hard Drive.jpg](https://commons.wikimedia.org/wiki/File:Toshiba_1_TB_External_USB_Hard_Drive.jpg) | Editor182 | Public domain |
| hdmi-cable.jpg | [Computer HDMI cable (2026).jpg](https://commons.wikimedia.org/wiki/File:Computer_HDMI_cable_(2026).jpg) | Gpkp | CC BY-SA 4.0 |
| usb-drive.jpg | [USB flash drive, 1TB.jpg](https://commons.wikimedia.org/wiki/File:USB_flash_drive,_1TB.jpg) | EU+Mexico | CC0 |
| tv-wall.jpg (solo en `products/`) | [LG 로봇, 업계 첫 디자인 '대통령상' 수상 (24107621107).jpg](https://commons.wikimedia.org/wiki/File:LG_%EB%A1%9C%EB%B4%87,_%EC%97%85%EA%B3%84_%EC%B2%AB_%EB%94%94%EC%9E%90%EC%9D%B8_%27%EB%8C%80%ED%86%B5%EB%A0%B9%EC%83%81%27_%EC%88%98%EC%83%81_(24107621107).jpg) | LG전자 (LG Electronics) | CC BY 2.0 |
| tv-black.jpg (solo en `products/`) | [Mivar 32led1 100Hz.jpg](https://commons.wikimedia.org/wiki/File:Mivar_32led1_100Hz.jpg) | Enzo1 | CC BY-SA 3.0 |

## Catálogo recortado (`products/`)

`products/*.jpg` son versiones de las fotos de arriba con el **fondo quitado** y el producto centrado sobre blanco
(1200 × 900), para que se fundan con la tarjeta blanca. Se generaron con [rembg](https://github.com/danielgatis/rembg)
(MIT, modelo `isnet-general-use`) fuera del proyecto; no es una dependencia. Son obras derivadas: llevan la misma
atribución y licencia que su original (las CC BY-SA, con la misma licencia). `microsd.jpg` aún no tiene recorte limpio y
el catálogo usa la original. Igual que el resto, se reemplazan por fotos propias en F8, ya tomadas sobre blanco.
