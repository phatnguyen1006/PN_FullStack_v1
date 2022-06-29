import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Upvote extends BaseEntity {
    @PrimaryColumn()
    userID!: number;

    @PrimaryColumn()
    postID!: number;

    @Column()
    value!: number;

    // FOREIGN KEYS
    @ManyToOne((_to) => Post, (post) => post.upvotes)
    post!: Post;

    @ManyToOne((_to) => User, (user) => user.upvotes)
    user!: User;
}
