CREATE TABLE public."Users"
(
    "Id" integer NOT NULL DEFAULT nextval('"Users_Id_seq"'::regclass),
    "UserId" uuid NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Password" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "RoleCD" integer NOT NULL,
    "GarageId" integer,
    "IsActive" boolean NOT NULL DEFAULT true,
    "IsDeleted" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id"),
    CONSTRAINT "Users_Email_key" UNIQUE ("Email")
)