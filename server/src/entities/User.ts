import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

//- Decorator
@ObjectType() // define type when return
@Entity() // create db table
export class User extends BaseEntity {
  @Field((_type) => ID) // define it is a field will return
  @PrimaryGeneratedColumn() // auto gen PRIMARY KEY
  id!: number; //- id!: not null

  @Field()
  @Column({ unique: true }) // normal column
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @CreateDateColumn() // auto gen created Date = new Date()
  createdAt: Date;

  @Field()
  @UpdateDateColumn() // auto gen updated Date
  updatedAt: Date;

  // FOREIGN KEYS
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
