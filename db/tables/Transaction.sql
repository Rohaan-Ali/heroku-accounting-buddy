CREATE TABLE public."Transactions"
(
    "Id" integer NOT NULL DEFAULT nextval('"Transactions_Id_seq"'::regclass),
    "Type" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Amount" bigint NOT NULL,
    "Receipt" bytea NOT NULL,
    "ItemType" integer NOT NULL,
    "ItemId" integer NOT NULL,
    "UserId" uuid NOT NULL,
    "IsApproved" boolean NOT NULL DEFAULT false,
    "IsDeleted" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("Id")
)