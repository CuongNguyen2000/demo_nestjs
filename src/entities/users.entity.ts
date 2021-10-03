import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from './base.entity';
import bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class Users extends BaseEntity {
    @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    password: string;

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
