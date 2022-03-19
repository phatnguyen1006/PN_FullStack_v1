import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//- Decorator
@Entity()   // create db table
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()   // auto gen PRIMARY KEY
    id!: number                 //- id!: not null

    @Column({ unique: true })   // normal column
    username!: string

    @Column({ unique: true })
    email!: string
    
    @Column()
    password!: string
    
    @CreateDateColumn()         // auto gen created Date = new Date()
    createdAt: Date
    
    @UpdateDateColumn()         // auto gen updated Date
    updatedAt: Date

}