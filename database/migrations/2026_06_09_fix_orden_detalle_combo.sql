-- ============================================================
--  Migración: FIX soporte de combos en Orden_Detalle
--  Fecha:     2026-06-09
--  Contexto:
--      Crear un pedido que contiene un COMBO devolvía HTTP 500.
--      Reproducido contra el API en vivo:
--          - Pedido solo-SKU   -> 201 OK
--          - Pedido solo-combo -> 500 (excepción en SaveChangesAsync)
--      Causa raíz (confirmada): la columna Orden_Detalle.codigo_sku
--      es NOT NULL y tiene una FK (fk_detalle_sku -> SKU) encima, por
--      lo que NO se podía volver NULL-able. Por eso la parte 3 de
--      2026_06_03_add_combos.sql falló en producción y las líneas de
--      combo (codigo_sku = NULL) son rechazadas por la BD.
--      Mensaje original:
--        "ALTER TABLE ALTER COLUMN codigo_sku failed because one or
--         more objects access this column" (depende de fk_detalle_sku).
--
--  Solución: soltar la FK de codigo_sku -> volver la columna NULL-able
--  -> recrear la FK; y asegurar id_combo + FK a Combo + el check.
--
--  IDEMPOTENTE: cada paso está guardado y es seguro re-ejecutar.
--  Se ejecuta en batches separados (GO) SIN transacción multi-batch
--  para evitar el problema de "COMMIT sin BEGIN" cuando un batch falla.
--
--  Ejecutar en la BD de producción (DLujo_Prod) desde el Azure
--  Portal > Query editor, o con un cliente SQL autorizado.
-- ============================================================

-- USE [DLujo_Prod];   -- (el Query editor del portal ya está en la BD)
-- GO

-- ── 1. Soltar TODA FK que esté sobre la columna codigo_sku ────
--     (típicamente fk_detalle_sku -> SKU). Se recrea en el paso 4.
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += N'ALTER TABLE dbo.Orden_Detalle DROP CONSTRAINT ' + QUOTENAME(fk.name) + N';' + CHAR(10)
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
JOIN sys.columns c ON c.object_id = fkc.parent_object_id AND c.column_id = fkc.parent_column_id
WHERE fk.parent_object_id = OBJECT_ID(N'dbo.Orden_Detalle')
  AND c.name = N'codigo_sku';
IF @sql <> N'' EXEC sp_executesql @sql;
GO

-- ── 2. Soltar cualquier CHECK que mencione codigo_sku ─────────
--     (un posible check legacy y el propio chk_detalle_sku_o_combo,
--      que se re-crea con la definición correcta en el paso 6).
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += N'ALTER TABLE dbo.Orden_Detalle DROP CONSTRAINT ' + QUOTENAME(name) + N';' + CHAR(10)
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID(N'dbo.Orden_Detalle')
  AND (name = N'chk_detalle_sku_o_combo' OR definition LIKE N'%codigo_sku%');
IF @sql <> N'' EXEC sp_executesql @sql;
GO

-- ── 3. codigo_sku -> NULL-able, IGUALANDO el tipo real de SKU ─
--     El tipo real de dbo.SKU.codigo_sku en producción NO es
--     necesariamente NVARCHAR(20) (el modelo EF asume eso, pero la
--     BD difiere; por eso fallaba la FK con error 1778). Leemos el
--     tipo+longitud exactos de SKU.codigo_sku y los replicamos aquí,
--     sólo agregando NULL. Así la FK del paso 4 siempre coincide.
DECLARE @ty SYSNAME, @ml INT, @lentok NVARCHAR(20), @stmt NVARCHAR(MAX);
SELECT @ty = ty.name, @ml = c.max_length
FROM sys.columns c
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE c.object_id = OBJECT_ID(N'dbo.SKU') AND c.name = N'codigo_sku';

SET @lentok = CASE
    WHEN @ml = -1 THEN N'max'
    WHEN @ty IN (N'nvarchar', N'nchar') THEN CONVERT(NVARCHAR(20), @ml / 2)
    ELSE CONVERT(NVARCHAR(20), @ml)
END;

SET @stmt = N'ALTER TABLE dbo.Orden_Detalle ALTER COLUMN codigo_sku '
          + @ty + N'(' + @lentok + N') NULL;';
EXEC sp_executesql @stmt;
GO

-- ── 4. Recrear la FK codigo_sku -> SKU ────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys fk
    JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
    JOIN sys.columns c ON c.object_id = fkc.parent_object_id AND c.column_id = fkc.parent_column_id
    WHERE fk.parent_object_id = OBJECT_ID(N'dbo.Orden_Detalle') AND c.name = N'codigo_sku'
)
    ALTER TABLE dbo.Orden_Detalle
        ADD CONSTRAINT FK_OrdenDetalle_SKU FOREIGN KEY (codigo_sku)
            REFERENCES dbo.SKU (codigo_sku);
GO

-- ── 5. Agregar id_combo + FK a Combo si faltan ────────────────
IF COL_LENGTH(N'dbo.Orden_Detalle', N'id_combo') IS NULL
    ALTER TABLE dbo.Orden_Detalle ADD id_combo INT NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_OrdenDetalle_Combo')
    ALTER TABLE dbo.Orden_Detalle
        ADD CONSTRAINT FK_OrdenDetalle_Combo FOREIGN KEY (id_combo)
            REFERENCES dbo.Combo (id_combo);
GO

-- ── 6. Re-crear el check "exactamente uno de (codigo_sku,id_combo)"
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'chk_detalle_sku_o_combo')
    ALTER TABLE dbo.Orden_Detalle
        ADD CONSTRAINT chk_detalle_sku_o_combo CHECK (
            (codigo_sku IS NOT NULL AND id_combo IS NULL) OR
            (codigo_sku IS NULL     AND id_combo IS NOT NULL)
        );
GO

-- ============================================================
--  Verificación
--  Esperado: codigo_sku.is_nullable = 1, existe id_combo,
--  FK_OrdenDetalle_SKU, FK_OrdenDetalle_Combo y chk_detalle_sku_o_combo
-- ============================================================
SELECT c.name AS columna, c.is_nullable
FROM sys.columns c
WHERE c.object_id = OBJECT_ID(N'dbo.Orden_Detalle')
  AND c.name IN (N'codigo_sku', N'id_combo');

SELECT name AS check_constraint, definition
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID(N'dbo.Orden_Detalle');

SELECT name AS foreign_key
FROM sys.foreign_keys
WHERE parent_object_id = OBJECT_ID(N'dbo.Orden_Detalle');
GO
