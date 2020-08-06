CREATE TABLE public."Cars"
(
    "Id" integer NOT NULL DEFAULT nextval('"Cars_Id_seq"'::regclass),
    "Model" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Make" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "RegistrationNumber" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "IsPrivate" boolean NOT NULL DEFAULT true,
    "GarageId" integer NOT NULL,
    "IsDeleted" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Cars_pkey" PRIMARY KEY ("Id")
)