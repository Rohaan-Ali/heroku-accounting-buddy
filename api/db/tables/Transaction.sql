CREATE TABLE public."Transaction"
(
    "Id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Type" character varying(50)[] COLLATE pg_catalog."default" NOT NULL,
    "Amount" bigint NOT NULL,
    "Receipt" bytea,
    "ItemType" integer NOT NULL,
    "ItemId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "IsApproved" boolean NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp without time zone NOT NULL,
    "UpdatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("Id")
)