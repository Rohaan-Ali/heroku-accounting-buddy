CREATE TABLE public."User"
(
    "Id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "UserId" uuid NOT NULL,
    "Name" character varying(50)[] COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying(50)[] COLLATE pg_catalog."default" NOT NULL,
    "Password" character varying(200)[] COLLATE pg_catalog."default" NOT NULL,
    "RoleCD" integer NOT NULL,
    "GarageId" integer,
    "IsActive" boolean NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp without time zone NOT NULL,
    "UpdatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
)