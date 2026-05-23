-- ============================================================
--  Migración: Agregar campos de información de entrega a Cliente
--  Fecha:     2026-05-23
--  Descripción:
--      Agrega los campos necesarios para capturar la información
--      completa de entrega del cliente desde el formulario del
--      carrito de compras (apellidos, dirección completa,
--      ciudad, departamento, código postal, país).
-- ============================================================

USE [EmpanadasDLujoDB];   -- Ajustar según el nombre real de la BD
GO

BEGIN TRANSACTION;
GO

-- ── Apellidos ────────────────────────────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'apellidos' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD apellidos NVARCHAR(100) NULL;
END
GO

-- ── Casa / Apartamento (opcional) ────────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'casa_apartamento' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD casa_apartamento NVARCHAR(100) NULL;
END
GO

-- ── Ciudad ───────────────────────────────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'ciudad' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD ciudad NVARCHAR(100) NULL;
END
GO

-- ── Departamento (Provincia / Estado) ────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'departamento' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD departamento NVARCHAR(100) NULL;
END
GO

-- ── Código postal (opcional) ─────────────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'codigo_postal' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD codigo_postal NVARCHAR(20) NULL;
END
GO

-- ── País (default 'Colombia') ────────────────────────────────
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'pais' AND Object_ID = OBJECT_ID(N'dbo.Cliente')
)
BEGIN
    ALTER TABLE dbo.Cliente
        ADD pais NVARCHAR(50) NULL
            CONSTRAINT DF_Cliente_Pais DEFAULT (N'Colombia');
END
GO

-- ── Backfill: setear país en registros existentes ────────────
UPDATE dbo.Cliente
SET    pais = N'Colombia'
WHERE  pais IS NULL;
GO

COMMIT TRANSACTION;
GO

-- ============================================================
--  Verificación
-- ============================================================
SELECT TOP 5
    id_cliente,
    nombre,
    apellidos,
    telefono,
    email,
    direccion,
    casa_apartamento,
    ciudad,
    departamento,
    codigo_postal,
    pais,
    nit,
    activo
FROM dbo.Cliente
ORDER BY id_cliente DESC;
GO
