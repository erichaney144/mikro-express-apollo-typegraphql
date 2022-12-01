import { Migration } from '@mikro-orm/migrations';

export class Migration20221201180931 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "publisher" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "type" text check ("type" in (\'local\', \'global\')) not null);');

    this.addSql('create table "author" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "born" timestamptz(0) null, "favourite_book_id" int null);');
    this.addSql('alter table "author" add constraint "author_email_unique" unique ("email");');

    this.addSql('create table "book" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "author_id" int not null, "publisher_id" int null);');

    this.addSql('create table "tag" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "book_tags" ("book_id" int not null, "tag_id" int not null, constraint "book_tags_pkey" primary key ("book_id", "tag_id"));');

    this.addSql('alter table "author" add constraint "author_favourite_book_id_foreign" foreign key ("favourite_book_id") references "book" ("id") on update cascade on delete set null;');

    this.addSql('alter table "book" add constraint "book_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "book" add constraint "book_publisher_id_foreign" foreign key ("publisher_id") references "publisher" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "book_tags" add constraint "book_tags_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "book_tags" add constraint "book_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" drop constraint "book_publisher_id_foreign";');

    this.addSql('alter table "book" drop constraint "book_author_id_foreign";');

    this.addSql('alter table "author" drop constraint "author_favourite_book_id_foreign";');

    this.addSql('alter table "book_tags" drop constraint "book_tags_book_id_foreign";');

    this.addSql('alter table "book_tags" drop constraint "book_tags_tag_id_foreign";');

    this.addSql('drop table if exists "publisher" cascade;');

    this.addSql('drop table if exists "author" cascade;');

    this.addSql('drop table if exists "book" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "book_tags" cascade;');
  }

}
