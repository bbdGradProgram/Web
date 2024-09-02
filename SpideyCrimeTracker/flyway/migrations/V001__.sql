CREATE TABLE [Area] (
    [areaId] int PRIMARY KEY IDENTITY(1, 1),
    [suburb] varchar(50),
    [province] varchar(50)
    )
    GO

CREATE TABLE [User] (
    [userId] int PRIMARY KEY IDENTITY(1, 1),
    [username] varchar(max),
    [roleId] int
    )
    GO

CREATE TABLE [Incident] (
    [incidentId] int PRIMARY KEY IDENTITY(1, 1),
    [date] datetime2,
    [description] varchar(max),
    [userId] int,
    [hotspotId] int
    )
    GO

CREATE TABLE [Role] (
    [roleId] int PRIMARY KEY IDENTITY(1, 1),
    [roleType] varchar(50)
    )
    GO

CREATE TABLE [HotspotType] (
    [hotspotTypeId] int PRIMARY KEY IDENTITY(1, 1),
    [hotspotType] varchar(50)
    )
    GO

CREATE TABLE [Hotspot] (
    [hotspotId] int PRIMARY KEY IDENTITY(1, 1),
    [description] varchar(max),
    [areaId] int,
    [hotspotTypeId] int
    )
    GO

ALTER TABLE [User] ADD FOREIGN KEY ([roleId]) REFERENCES [Role] ([roleId])
    GO

ALTER TABLE [Incident] ADD FOREIGN KEY ([userId]) REFERENCES [User] ([userId])
    GO

ALTER TABLE [Incident] ADD FOREIGN KEY ([hotspotId]) REFERENCES [Hotspot] ([hotspotId])
    GO

ALTER TABLE [Hotspot] ADD FOREIGN KEY ([areaId]) REFERENCES [Area] ([areaId])
    GO

ALTER TABLE [Hotspot] ADD FOREIGN KEY ([hotspotTypeId]) REFERENCES [HotspotType] ([hotspotTypeId])
    GO
