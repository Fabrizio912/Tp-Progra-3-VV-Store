-- Base de datos del TP Integrador Programación III : tp_tienda_de_ropa
-- Categorías: 'clothes' (ropa) y 'shoes' (calzado)

CREATE DATABASE IF NOT EXISTS `tp_tienda_de_ropa`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `tp_tienda_de_ropa`;

-- Borra las tablas si ya existen, asi podemos correr el script de nuevo.
-- El FOREIGN_KEY_CHECKS = 0 es para poder borrarlas en cualquier orden.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `product_sales`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabla users: los admins del backoffice (el password se guarda con bcrypt)
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla products: active = 1 se muestra al cliente, active = 0 esta dado de baja
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL,
  `category` enum('clothes','shoes') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla sales: una fila por cada compra
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(10,2) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla product_sales: une productos con ventas (relacion muchos a muchos)
-- quantity = cuantas unidades de ese producto se compraron
-- unit_price = lo que costaba el producto cuando se hizo la venta
CREATE TABLE `product_sales` (
  `sale_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`sale_id`,`product_id`),
  CONSTRAINT `fk_ps_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ps_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos para la tabla `users`
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Johnny', 'johnny@melavo.com', 'melavo'),
(2, 'Johnny Knoxville', 'johnny@knoxville.com', 'knoxville'),
(3, 'Bam Margera', 'bam@margera.com', 'margera'),
(4, 'coso', 'coso@coso.com', 'coso'),
(5, 'Jose Maria', 'jose@maria.com', 'jose'),
(6, 'Pepe Argento', 'pepe@argento.com.ar', 'pepe'),
(7, 'test', 'test@test.com', 'test'),
(8, 'Rusa', 'rusa@rusa.com', '123'),
(9, 'elbarto', 'el@barto.com', 'elbarto'),
(10, 'uno', 'uno@uno.com', '$2b$10$ScA2GLrUcopmXa3OLxTqGemQ/DuYpS1fDomc1LRgArJCLaF22Okx6'),
(11, 'pedro', 'pe@dro.com', '$2b$10$Zma8h06soNQZbr1tjx0FtueQ.G/H5iu6IwqrhtaiwIuOYa80pLl6q'),
(12, 'Bob Patino', 'bob@patino.com', 'bob'),
(13, 'merlin', 'mer@lin.com', 'merlin'),
(14, 'thiago', 'thi@ago.com', '$2b$10$wemYF.qxnldHTJnMdxNcQeUBqZHz.FhqUBEmmCCcp/ODZTjq7E3yi');

-- Datos de products: ropa (ids 1 al 12) y zapatillas (ids 13 al 24)
-- Los ids 12 y 24 están inactivos para probar la reactivación.
INSERT INTO `products` (`id`, `name`, `description`, `image`, `category`, `price`, `active`) VALUES
(1,  'Remera básica blanca',      'Remera de algodón peinado, corte clásico',        'https://remeraspormayor.com/assets/productos/clasica/blanco.webp',     'clothes', 12000.00, 1),
(2,  'Remera básica negra',       'Remera de algodón peinado, corte clásico',        'https://modobasicos.com/cdn/shop/files/mb-foto-negra-frente.jpg?v=1790882662&width=1400',      'clothes', 12000.00, 1),
(3,  'Remera oversize estampada', 'Remera holgada con estampa frontal',              'https://www.grisino.com/media/catalog/product/g/1/g1rt09ng.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=975&width=650&canvas=650:975',   'clothes', 18500.00, 1),
(4,  'Buzo canguro gris',         'Buzo con capucha y bolsillo, friza interior',     'https://acdn-us.mitiendanube.com/stores/001/685/943/products/590fac6e-007e-475e-8bb0-c6e66d70b4d5-33681f3f469f3443cc17530654893601-1024-1024.webp',      'clothes', 38000.00, 1),
(5,  'Campera de jean',           'Campera de jean azul clásica',                    'https://acdn-us.mitiendanube.com/stores/001/856/731/products/chatgpt-image-19-mar-2026-19_43_14-1fd2310a40fd3c597317739602247712-1024-1024.webp',      'clothes', 62000.00, 1),
(6,  'Jean recto azul',           'Jean de corte recto, tiro medio',                 'https://http2.mlstatic.com/D_NQ_NP_2X_837224-MLA84524916366_052025-F.jpg',        'clothes', 45000.00, 1),
(7,  'Pantalón cargo beige',      'Pantalón cargo con bolsillos laterales',          'https://acdn-us.mitiendanube.com/stores/001/648/069/products/plantilla-3086x4632-267-62f2e7716476def60f17756862433467-1024-1024.webp',    'clothes', 41000.00, 1),
(8,  'Short deportivo',           'Short liviano para entrenar',                     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd6WIJJde-bUTC_uakSgbQ5hOlsN7gA4rvK5zCmirEKVieQwOnc72NlnF5&s=10',   'clothes', 16000.00, 1),
(9,  'Camisa de lino',            'Camisa manga larga de lino natural',              'https://dcdn-us.mitiendanube.com/stores/004/203/857/products/376254487-2-4x5-98f980593a73cc94eb17939839567586-1024-1024.webp',       'clothes', 34000.00, 1),
(10, 'Gorra negra',            'Gorra de New York Yankees',                          'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/470978s.jpg?im=Resize,width=750',    'clothes', 46600.00, 1),
(11, 'Campera rompevientos negra',      'Campera impermeable liviana con capucha',   'https://acdn-us.mitiendanube.com/stores/001/463/423/products/tienda-nube-publicacion-19-9d96d3cb1295064adc17734311095494-1024-1024.webp',      'clothes', 55000.00, 1),
(12, 'Medias pack x3',            'Pack de tres pares de medias de algodón',         'https://http2.mlstatic.com/D_NQ_NP_2X_876184-MLA110857845061_042026-F.jpg',         'clothes',  8000.00, 0),

(13, 'Zapatillas urbanas blancas','Zapatillas de cuero sintético para uso diario',   'https://acdn-us.mitiendanube.com/stores/493/394/products/zapatilla-baru-blanca-perfil-f29e42c3dacebcbe1d17441491082072-1024-1024.webp',   'shoes',   72000.00, 1),
(14, 'Zapatillas running Aero',   'Zapatillas livianas con amortiguación',           'https://http2.mlstatic.com/D_NQ_NP_738709-CBT115202386190_082026-O.jpg',      'shoes',   95000.00, 1),
(15, 'Zapatillas skate negras',   'Zapatillas reforzadas con suela vulcanizada',     'https://calvinargentina.vtexassets.com/arquivos/ids/289108-1200-1600?v=639174082917330000&width=1200&height=1600&aspect=true',      'shoes',   68000.00, 1),
(16, 'Botas de cuero',            'Botas de cuero vacuno con suela de goma',         'https://i0.wp.com/arandu.com.ar/wp-content/uploads/2025/09/030G-5.png?fit=1632%2C2048&ssl=1',       'shoes',  120000.00, 1),
(17, 'Botitas de lona',           'Botitas de lona',                                 'https://acdn-us.mitiendanube.com/stores/002/928/307/products/790e9813-5a90-46e1-b964-d414cd0be500-2fd405d7e5b404e6be17732491115149-1024-1024.webp',        'shoes',   54000.00, 1),
(18, 'Sandalias de cuero',        'Sandalias con hebilla ajustable',                 'https://dcdn-us.mitiendanube.com/stores/002/832/355/products/formato-producto-23-58ae8d0eb7dd8703f517263384359151-1024-1024.webp',         'shoes',   38000.00, 1),
(19, 'Mocasines clásicos',        'Mocasines de cuero para uso formal',              'https://acdn-us.mitiendanube.com/stores/598/845/products/364-new-1-95719127bdd33ce48217641096698179-1024-1024.webp',         'shoes',   82000.00, 1),
(20, 'Zapatillas trekking',       'Calzado de montaña con suela antideslizante',     'https://http2.mlstatic.com/D_NQ_NP_972508-MLA106583268501_022026-O.jpg',          'shoes',  110000.00, 1),
(21, 'Ojotas',                    'Ojotas de goma livianas',                         'https://acdn-us.mitiendanube.com/stores/005/974/143/products/lammai-black-3-98b07e95310934ef1017558761719652-1024-1024.webp',            'shoes',   12000.00, 1),
(22, 'Zapatillas de básquet',     'Zapatillas con tobillera y buen agarre',          'https://cdn.runrepeat.com/storage/gallery/product_primary/41003/nike-le-bron-23-lab-test-and-review-23697124-main.webp',           'shoes',   98000.00, 1),
(23, 'Alpargatas',                'Alpargatas de yute y lona',                       'https://acdn-us.mitiendanube.com/stores/001/150/169/products/0e00d256-ce7f-475b-9830-ed43db1c5e06-3205e9203daeeedd5f16969751172130-640-0.webp',        'shoes',   22000.00, 1),
(24, 'Botines de fútbol',         'Botines con tapones para césped natural',         'https://acdn-us.mitiendanube.com/stores/002/059/331/products/1052869_main-bf838cfb6115e63b0a17893817816839-1024-1024.webp',           'shoes',   85000.00, 0);

-- Volcado de datos para la tabla `sales`
INSERT INTO `sales` (`id`, `date`, `total_price`, `user_name`) VALUES
(1, '2025-12-03 15:46:37',  40000.00, 'Fran'),
(2, '2025-12-17 18:03:55',  90500.00, 'xabi'),
(3, '2026-06-10 14:03:32', 220000.00, 'Lautaro'),
(4, '2026-06-11 12:04:51',  32000.00, 'Gonzalo'),
(5, '2026-06-11 12:18:37', 150000.00, 'Kevin');

-- Volcado de datos para la tabla `product_sales`
INSERT INTO `product_sales` (`sale_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1,  2,  12000.00),
(1, 8,  1,  16000.00),
(2, 13, 1,  72000.00),
(2, 3,  1,  18500.00),
(3, 16, 1, 120000.00),
(3, 5,  1,  62000.00),
(3, 4,  1,  38000.00),
(4, 2,  2,  12000.00),
(4, 12, 1,   8000.00),
(5, 14, 1,  95000.00),
(5, 11, 1,  55000.00);
