-- ============================================================
--  Empanadas D'Lujo - Modelo Relacional SQL Server
--  Versión: 1.0  |  Fecha: 2026
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'EmpanadasDLujo')
    CREATE DATABASE EmpanadasDLujo
    COLLATE Latin1_General_CI_AS;
GO

USE EmpanadasDLujo;
GO

-- ============================================================
--  1. CATEGORÍAS
-- ============================================================
CREATE TABLE Categorias (
    Id       INT           IDENTITY(1,1) PRIMARY KEY,
    Nombre   NVARCHAR(50)  NOT NULL,
    Activo   BIT           NOT NULL CONSTRAINT DF_Categorias_Activo DEFAULT 1
);
GO

-- ============================================================
--  2. PRODUCTOS
-- ============================================================
CREATE TABLE Productos (
    Id                  NVARCHAR(20)   PRIMARY KEY,          -- Código SKU
    CategoriaId         INT            NOT NULL,
    Nombre              NVARCHAR(100)  NOT NULL,
    Sabor               NVARCHAR(100)  NOT NULL,
    GramajeGr           DECIMAL(10,2)  NOT NULL,
    UnidadesPorPaquete  INT            NOT NULL,
    -- Precios por paquete
    PrecioCosto         DECIMAL(12,2)  NOT NULL,             -- Precio de costo
    PVxM                DECIMAL(12,2)  NOT NULL,             -- Precio venta mayorista
    PVxD                DECIMAL(12,2)  NOT NULL,             -- Precio venta detallista
    Activo              BIT            NOT NULL CONSTRAINT DF_Productos_Activo DEFAULT 1,
    FechaCreacion       DATETIME       NOT NULL CONSTRAINT DF_Productos_FechaCreacion DEFAULT GETDATE(),
    FechaActualizacion  DATETIME       NULL,

    CONSTRAINT FK_Productos_Categorias FOREIGN KEY (CategoriaId)
        REFERENCES Categorias(Id),
    CONSTRAINT CK_Productos_GramajeGr           CHECK (GramajeGr > 0),
    CONSTRAINT CK_Productos_UnidadesPorPaquete  CHECK (UnidadesPorPaquete > 0),
    CONSTRAINT CK_Productos_PrecioCosto         CHECK (PrecioCosto >= 0),
    CONSTRAINT CK_Productos_PVxM                CHECK (PVxM >= 0),
    CONSTRAINT CK_Productos_PVxD                CHECK (PVxD >= 0)
);
GO

-- ============================================================
--  3. CLIENTES
-- ============================================================
CREATE TABLE Clientes (
    Id             INT           IDENTITY(1,1) PRIMARY KEY,
    Nombre         NVARCHAR(100) NOT NULL,
    Telefono       NVARCHAR(20)  NULL,
    Direccion      NVARCHAR(200) NULL,
    Email          NVARCHAR(100) NULL,
    Activo         BIT           NOT NULL CONSTRAINT DF_Clientes_Activo DEFAULT 1,
    FechaCreacion  DATETIME      NOT NULL CONSTRAINT DF_Clientes_FechaCreacion DEFAULT GETDATE(),

    CONSTRAINT UQ_Clientes_Email    UNIQUE (Email),
    CONSTRAINT UQ_Clientes_Telefono UNIQUE (Telefono)
);
GO

-- ============================================================
--  4. PEDIDOS
-- ============================================================
CREATE TABLE Pedidos (
    Id             INT            IDENTITY(1,1) PRIMARY KEY,
    ClienteId      INT            NULL,
    FechaPedido    DATETIME       NOT NULL CONSTRAINT DF_Pedidos_FechaPedido DEFAULT GETDATE(),
    FechaEntrega   DATETIME       NULL,
    -- Estado: Pendiente | Confirmado | EnPreparacion | Entregado | Cancelado
    Estado         NVARCHAR(20)   NOT NULL CONSTRAINT DF_Pedidos_Estado DEFAULT 'Pendiente',
    -- Tipo de precio aplicado al pedido: PVxD | PVxM
    TipoPrecio     NVARCHAR(5)    NOT NULL CONSTRAINT DF_Pedidos_TipoPrecio DEFAULT 'PVxD',
    Total          DECIMAL(12,2)  NOT NULL CONSTRAINT DF_Pedidos_Total DEFAULT 0,
    Notas          NVARCHAR(500)  NULL,
    FechaCreacion  DATETIME       NOT NULL CONSTRAINT DF_Pedidos_FechaCreacion DEFAULT GETDATE(),

    CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (ClienteId)
        REFERENCES Clientes(Id),
    CONSTRAINT CK_Pedidos_Estado     CHECK (Estado IN ('Pendiente','Confirmado','EnPreparacion','Entregado','Cancelado')),
    CONSTRAINT CK_Pedidos_TipoPrecio CHECK (TipoPrecio IN ('PVxD','PVxM')),
    CONSTRAINT CK_Pedidos_Total      CHECK (Total >= 0)
);
GO

-- ============================================================
--  5. DETALLE PEDIDO
-- ============================================================
CREATE TABLE DetallePedido (
    Id              INT            IDENTITY(1,1) PRIMARY KEY,
    PedidoId        INT            NOT NULL,
    ProductoId      NVARCHAR(20)   NOT NULL,
    Cantidad        INT            NOT NULL,
    -- 1 = precio de paquete, 0 = precio de unidad
    EsPaquete       BIT            NOT NULL CONSTRAINT DF_Detalle_EsPaquete DEFAULT 1,
    PrecioUnitario  DECIMAL(12,2)  NOT NULL,  -- precio histórico al momento del pedido
    Subtotal        AS (CAST(Cantidad AS DECIMAL(12,2)) * PrecioUnitario) PERSISTED,

    CONSTRAINT FK_Detalle_Pedidos   FOREIGN KEY (PedidoId)   REFERENCES Pedidos(Id),
    CONSTRAINT FK_Detalle_Productos FOREIGN KEY (ProductoId) REFERENCES Productos(Id),
    CONSTRAINT CK_Detalle_Cantidad  CHECK (Cantidad > 0),
    CONSTRAINT CK_Detalle_Precio    CHECK (PrecioUnitario >= 0)
);
GO

-- ============================================================
--  ÍNDICES
-- ============================================================
CREATE INDEX IX_Productos_CategoriaId  ON Productos (CategoriaId);
CREATE INDEX IX_Pedidos_ClienteId      ON Pedidos   (ClienteId);
CREATE INDEX IX_Pedidos_Estado         ON Pedidos   (Estado);
CREATE INDEX IX_DetallePedido_PedidoId ON DetallePedido (PedidoId);
GO
