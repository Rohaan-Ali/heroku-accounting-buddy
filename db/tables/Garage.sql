CREATE TABLE public."Garages"
(
    "Id" integer NOT NULL DEFAULT nextval('"Garages_Id_seq"'::regclass),
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Address" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "BusinessNumber" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Workers" json,
    "IsActive" boolean NOT NULL DEFAULT true,
    "IsDeleted" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Garages_pkey" PRIMARY KEY ("Id")
)