-- ============================================================
--  Rollback: Soporte de venta de COMBOS
--  Fecha:     2026-06-03
--  Descripción:
--      Revierte la migración 2026_06_03_add_combos.sql.
--      ⚠️  Falla a propósito si existen órdenes con líneas de
--          combo (id_combo NOT NULL en Orden_Detalle), para no
--          perder historial de ventas. Anula/borra esas órdenes
--          antes de ejecutar el rollback.
-- ============================================================

USE [EmpanadasDLujoDB];   -- Ajustar según el nombre real de la BD
GO

BEGIN TRANSACTION;
GO

-- Seguridad: no revertir si hay órdenes que usan combos
IF EXISTS (SELECT 1 FROM dbo.Orden_Detalle WHERE id_combo IS NOT NULL)
BEGIN
    RAISERROR(N'Existen Orden_Detalle con id_combo. Aborta el rollback para preservar historial.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
END
GO

-- Quitar check, FK y columna id_combo de Orden_Detalle
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'chk_detalle_sku_o_combo')
    ALTER TABLE dbo.Orden_Detalle DROP CONSTRAINT chk_detalle_sku_o_combo;
GO

IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_OrdenDetalle_Combo')
    ALTER TABLE dbo.Orden_Detalle DROP CONSTRAINT FK_OrdenDetalle_Combo;
GO

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'id_combo' AND Object_ID = OBJECT_ID(N'dbo.Orden_Detalle')
)
    ALTER TABLE dbo.Orden_Detalle DROP COLUMN id_combo;
GO

-- Restaurar codigo_sku a NOT NULL (sólo si no quedan filas con NULL)
IF NOT EXISTS (SELECT 1 FROM dbo.Orden_Detalle WHERE codigo_sku IS NULL)
    ALTER TABLE dbo.Orden_Detalle ALTER COLUMN codigo_sku NVARCHAR(20) NOT NULL;
GO

-- Eliminar tablas de combos
IF OBJECT_ID(N'dbo.Combo_Componente', N'U') IS NOT NULL
    DROP TABLE dbo.Combo_Componente;
GO

IF OBJECT_ID(N'dbo.Combo', N'U') IS NOT NULL
    DROP TABLE dbo.Combo;
GO

COMMIT TRANSACTION;
GO
