CREATE TABLE public."Car"
(
    "Id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Model" character varying(50)[] COLLATE pg_catalog."default" NOT NULL,
    "Make" character varying(100)[] COLLATE pg_catalog."default" NOT NULL,
    "RegistrationNumber" character varying(100)[] COLLATE pg_catalog."default" NOT NULL,
    "IsPrivate" boolean NOT NULL,
    "GarageId" integer NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp without time zone NOT NULL,
    "UpdatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "Car_pkey" PRIMARY KEY ("Id")
)