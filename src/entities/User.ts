// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Todo } from "./Todo";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 320, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 72, nullable: false })
  password!: string;

  @Column({ name: "profile_url", length: 2048, nullable: true })
  profileUrl?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  // 與 Todo 的一對多關係
  @OneToMany(() => Todo, (todo) => todo.user)
  todos?: Todo[];
}
