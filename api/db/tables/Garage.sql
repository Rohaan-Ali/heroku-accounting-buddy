CREATE TABLE public."Garage"
(
    "Id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Name" character varying(100)[] COLLATE pg_catalog."default" NOT NULL,
    "Address" character varying(200)[] COLLATE pg_catalog."default" NOT NULL,
    "BusinessNumber" character varying(100)[] COLLATE pg_catalog."default" NOT NULL,
    "IsActive" boolean NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp without time zone NOT NULL,
    "UpdatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "Garage_pkey" PRIMARY KEY ("Id")
)