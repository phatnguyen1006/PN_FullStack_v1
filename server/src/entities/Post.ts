import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field((_type) => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    userID!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    text!: string;

    @Field()
    @Column({ default: 0 })
    points!: number;

    @Field()
    @CreateDateColumn({ type: "timestamptz" }) // timestampt with zone
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" }) // timestampt with zone
    updatedAt: Date;

    // FOREIGN KEYS
    @Field((_type) => User)
    @ManyToOne(() => User, (user) => user.posts)
    user: User;

    @OneToMany((_to) => Upvote, (upvote) => upvote.post)
    upvotes: Upvote[];
}
