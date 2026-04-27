-- ============================================================
--  Empanadas D'Lujo - Carga inicial de datos
--  Fuente: Productos Empanadas D'lujo 2026.xlsx
-- ============================================================

USE EmpanadasDLujo;
GO

-- ============================================================
--  CATEGORÍAS
-- ============================================================
SET IDENTITY_INSERT Categorias ON;
INSERT INTO Categorias (Id, Nombre) VALUES
    (1, 'Empanadas'),
    (2, 'Pasteles'),
    (3, 'Masa');
SET IDENTITY_INSERT Categorias OFF;
GO

-- ============================================================
--  PRODUCTOS
--  Columnas de precio: PrecioCosto | PVxM | PVxD  (por paquete)
-- ============================================================
INSERT INTO Productos
    (Id, CategoriaId, Nombre, Sabor, GramajeGr, UnidadesPorPaquete, PrecioCosto, PVxM, PVxD)
VALUES
    -- Empanadas pequeñas (x50 unidades/paquete)
    ('DLJ-EMP-001', 1, 'Empanada Pequeña', 'Papa y Guiso',  30.00, 50, 10230.00, 15500.00, 17515.00),
    ('DLJ-EMP-002', 1, 'Empanada Pequeña', 'Papa y Carne',  30.00, 50, 16230.00, 21000.00, 27300.00),
    ('DLJ-EMP-003', 1, 'Empanada Pequeña', 'Papa y Pollo',  30.00, 50, 17230.00, 23900.00, 31070.00),
    -- Empanadas grandes (x12 unidades/paquete)
    ('DLJ-EMP-004', 1, 'Empanada Grande',  'Papa y Carne', 130.00, 12, 20520.00, 26700.00, 34710.00),
    ('DLJ-EMP-005', 1, 'Empanada Grande',  'Papa y Pollo', 130.00, 12, 20520.00, 26700.00, 34710.00),
    -- Empanada mediana (x30 unidades/paquete)
    ('DLJ-EMO-006', 1, 'Empanada Mediana', 'Papa y Carne',  50.00, 30, 18900.00, 24600.00, 31980.00),
    -- Pasteles pequeños (x30 unidades/paquete)
    ('DLJ-PAS-001', 2, 'Pastel Pequeño',   'Solo Pollo',    55.00, 30, 23400.00, 36000.00, 46800.00),
    -- Pasteles grandes (x12 unidades/paquete)
    ('DLJ-PAS-002', 2, 'Pastel Grande',    'Solo Pollo',   130.00, 12, 32400.00, 42000.00, 54600.00),
    ('DLJ-PAS-003', 2, 'Pastel Grande',    'Solo Carne',   130.00, 12, 36000.00, 46000.00, 59800.00),
    -- Masa (x1 kg)
    ('DLJ-MASA-001',3, 'Maíz Amarillo',    'Maíz',        1000.00,  1,  2300.00,  2300.00,  2507.00);
GO

-- ============================================================
--  CLIENTE GENÉRICO (para pedidos sin cliente registrado)
-- ============================================================
INSERT INTO Clientes (Nombre) VALUES ('Cliente General');
GO
