-- ============================================================
--  Migración: Soporte de venta de COMBOS
--  Fecha:     2026-06-03
--  Descripción:
--      1. Crea la tabla Combo (combo con precio fijo).
--      2. Crea la tabla Combo_Componente (los SKUs que incluye
--         cada combo, con su cantidad de paquetes).
--      3. Adapta Orden_Detalle para que una línea pueda
--         referenciar un SKU suelto O un combo (nunca ambos):
--         codigo_sku pasa a NULL-able y se agrega id_combo.
--      4. (Opcional) Carga los 3 combos base del catálogo 2026.
--
--  Tablas siguen el naming del modelo EF Core (no el .sql legacy).
-- ============================================================

USE [EmpanadasDLujoDB];   -- Ajustar según el nombre real de la BD
GO

BEGIN TRANSACTION;
GO

-- ============================================================
--  1. TABLA Combo
-- ============================================================
IF OBJECT_ID(N'dbo.Combo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Combo (
        id_combo          INT            IDENTITY(1,1) PRIMARY KEY,
        codigo_combo      NVARCHAR(20)   NOT NULL,
        nombre            NVARCHAR(100)  NOT NULL,
        subcategoria      NVARCHAR(50)   NULL,
        descripcion_corta NVARCHAR(255)  NULL,
        descripcion_larga NVARCHAR(1000) NULL,
        precio_normal     DECIMAL(12,2)  NOT NULL,
        precio_combo      DECIMAL(12,2)  NOT NULL,
        peso_total_g      DECIMAL(10,2)  NULL,
        unidades_totales  INT            NULL,
        activo            BIT            NOT NULL CONSTRAINT DF_Combo_Activo DEFAULT (1),
        orden             INT            NULL,
        url_image         NVARCHAR(255)  NULL,
        badge_descripcion NVARCHAR(100)  NULL,
        CONSTRAINT UQ_Combo_CodigoCombo UNIQUE (codigo_combo),
        CONSTRAINT CK_Combo_PrecioNormal CHECK (precio_normal >= 0),
        CONSTRAINT CK_Combo_PrecioCombo  CHECK (precio_combo  >= 0)
    );
END
GO

-- ============================================================
--  2. TABLA Combo_Componente
-- ============================================================
IF OBJECT_ID(N'dbo.Combo_Componente', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Combo_Componente (
        id_componente     INT          IDENTITY(1,1) PRIMARY KEY,
        id_combo          INT          NOT NULL,
        codigo_sku        NVARCHAR(20) NOT NULL,
        cantidad_paquetes INT          NOT NULL,
        CONSTRAINT FK_ComboComponente_Combo FOREIGN KEY (id_combo)
            REFERENCES dbo.Combo (id_combo) ON DELETE CASCADE,
        CONSTRAINT FK_ComboComponente_SKU FOREIGN KEY (codigo_sku)
            REFERENCES dbo.SKU (codigo_sku),
        CONSTRAINT UQ_ComboComponente_Combo_Sku UNIQUE (id_combo, codigo_sku),
        CONSTRAINT CK_ComboComponente_Cantidad CHECK (cantidad_paquetes > 0)
    );
END
GO

-- ============================================================
--  3. ADAPTAR Orden_Detalle
-- ============================================================
-- 3a. codigo_sku pasa a NULL-able (una línea de combo no tiene SKU)
IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'codigo_sku'
      AND Object_ID = OBJECT_ID(N'dbo.Orden_Detalle')
      AND is_nullable = 0
)
BEGIN
    ALTER TABLE dbo.Orden_Detalle
        ALTER COLUMN codigo_sku NVARCHAR(20) NULL;
END
GO

-- 3b. Agregar id_combo + FK
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'id_combo' AND Object_ID = OBJECT_ID(N'dbo.Orden_Detalle')
)
BEGIN
    ALTER TABLE dbo.Orden_Detalle
        ADD id_combo INT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = N'FK_OrdenDetalle_Combo'
)
BEGIN
    ALTER TABLE dbo.Orden_Detalle
        ADD CONSTRAINT FK_OrdenDetalle_Combo FOREIGN KEY (id_combo)
            REFERENCES dbo.Combo (id_combo);
END
GO

-- 3c. Check: exactamente uno de (codigo_sku, id_combo)
IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'chk_detalle_sku_o_combo'
)
BEGIN
    ALTER TABLE dbo.Orden_Detalle
        ADD CONSTRAINT chk_detalle_sku_o_combo CHECK (
            (codigo_sku IS NOT NULL AND id_combo IS NULL) OR
            (codigo_sku IS NULL     AND id_combo IS NOT NULL)
        );
END
GO

-- ============================================================
--  4. SEED de combos base (catálogo 2026)
--     Sólo inserta si NO existe el codigo_combo y si todos los
--     SKUs referenciados existen. Ajusta los codigo_sku si en tu
--     BD difieren de los del seed original.
-- ============================================================

-- ── COMBO-001  Antojo Casero ─────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM dbo.Combo WHERE codigo_combo = N'COMBO-001')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-EMP-001')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-PAS-001')
BEGIN
    INSERT INTO dbo.Combo
        (codigo_combo, nombre, subcategoria, descripcion_corta, descripcion_larga,
         precio_normal, precio_combo, peso_total_g, unidades_totales, orden)
    VALUES
        (N'COMBO-001', N'Combo Antojo Casero', N'Combo Inicial',
         N'Combo ideal para antojo en casa o primera prueba de producto',
         N'Incluye 1 paquete de Empanadas Papa y Guiso (50 und de 30g) + 1 paquete de Pastel de Pollo pequeño (30 und de 55g). Productos congelados listos para freír.',
         65800.00, 55000.00, 3150.00, 80, 1);

    DECLARE @c1 INT = SCOPE_IDENTITY();
    INSERT INTO dbo.Combo_Componente (id_combo, codigo_sku, cantidad_paquetes) VALUES
        (@c1, N'DLJ-EMP-001', 1),
        (@c1, N'DLJ-PAS-001', 1);
END
GO

-- ── COMBO-002  Reunión Familiar Plus ─────────────────────────
IF NOT EXISTS (SELECT 1 FROM dbo.Combo WHERE codigo_combo = N'COMBO-002')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-PAS-002')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-EMP-001')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-EMP-004')
BEGIN
    INSERT INTO dbo.Combo
        (codigo_combo, nombre, subcategoria, descripcion_corta, descripcion_larga,
         precio_normal, precio_combo, peso_total_g, unidades_totales, orden)
    VALUES
        (N'COMBO-002', N'Combo Reunión Familiar Plus', N'Combo Familiar',
         N'Ideal para compartir o empezar con más variedad',
         N'Incluye 1 paquete de Pastel Grande Solo Pollo (12 und de 130g) + 1 paquete de Empanadas Papa y Guiso (50 und de 30g) + 1 paquete de Empanadas Grandes Papa y Carne (12 und de 130g). Productos congelados listos para freír.',
         108300.00, 100000.00, 4620.00, 74, 2);

    DECLARE @c2 INT = SCOPE_IDENTITY();
    INSERT INTO dbo.Combo_Componente (id_combo, codigo_sku, cantidad_paquetes) VALUES
        (@c2, N'DLJ-PAS-002', 1),
        (@c2, N'DLJ-EMP-001', 1),
        (@c2, N'DLJ-EMP-004', 1);
END
GO

-- ── COMBO-003  Hogar de Lujo ─────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM dbo.Combo WHERE codigo_combo = N'COMBO-003')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-EMP-001')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-PAS-001')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-PAS-002')
   AND EXISTS (SELECT 1 FROM dbo.SKU WHERE codigo_sku = N'DLJ-EMP-004')
BEGIN
    INSERT INTO dbo.Combo
        (codigo_combo, nombre, subcategoria, descripcion_corta, descripcion_larga,
         precio_normal, precio_combo, peso_total_g, unidades_totales, orden)
    VALUES
        (N'COMBO-003', N'Combo Hogar de Lujo', N'Combo Premium',
         N'Ideal para familias, eventos pequeños o primeros pasos para reventa',
         N'Incluye 2 paquetes de Empanadas Papa y Guiso (50 und de 30g c/u) + 1 paquete de Pastel de Pollo pequeño (30 und de 55g) + 1 paquete de Pastel Grande Solo Pollo (12 und de 130g) + 1 paquete de Empanadas Grandes Papa y Carne (12 und de 130g). Productos congelados listos para freír.',
         174100.00, 150000.00, 7770.00, 154, 3);

    DECLARE @c3 INT = SCOPE_IDENTITY();
    INSERT INTO dbo.Combo_Componente (id_combo, codigo_sku, cantidad_paquetes) VALUES
        (@c3, N'DLJ-EMP-001', 2),
        (@c3, N'DLJ-PAS-001', 1),
        (@c3, N'DLJ-PAS-002', 1),
        (@c3, N'DLJ-EMP-004', 1);
END
GO

COMMIT TRANSACTION;
GO

-- ============================================================
--  Verificación
-- ============================================================
SELECT c.codigo_combo, c.nombre, c.precio_normal, c.precio_combo,
       (c.precio_normal - c.precio_combo) AS ahorro,
       c.unidades_totales, c.peso_total_g
FROM dbo.Combo c
ORDER BY c.orden;

SELECT cc.id_combo, c.codigo_combo, cc.codigo_sku, cc.cantidad_paquetes
FROM dbo.Combo_Componente cc
JOIN dbo.Combo c ON c.id_combo = cc.id_combo
ORDER BY cc.id_combo, cc.codigo_sku;
GO
