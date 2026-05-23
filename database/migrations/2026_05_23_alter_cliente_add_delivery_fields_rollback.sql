-- ============================================================
--  ROLLBACK: 2026_05_23_alter_cliente_add_delivery_fields
--  Descripción:
--      Revierte la migración eliminando los campos agregados.
--      ⚠️ ADVERTENCIA: este script elimina datos. Ejecutar
--      solo si se está seguro de querer revertir.
-- ============================================================

USE [EmpanadasDLujoDB];   -- Ajustar según el nombre real de la BD
GO

BEGIN TRANSACTION;
GO

-- ── pais: quitar default primero, luego columna ──────────────
IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_Cliente_Pais')
    ALTER TABLE dbo.Cliente DROP CONSTRAINT DF_Cliente_Pais;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'pais' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN pais;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'codigo_postal' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN codigo_postal;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'departamento' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN departamento;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'ciudad' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN ciudad;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'casa_apartamento' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN casa_apartamento;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'apellidos' AND Object_ID = OBJECT_ID(N'dbo.Cliente'))
    ALTER TABLE dbo.Cliente DROP COLUMN apellidos;
GO

COMMIT TRANSACTION;
GO
