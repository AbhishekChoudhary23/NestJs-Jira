import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  MANAGER = 'Manager',
  DEVELOPER = 'Developer',
  TESTER = 'Tester',
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ type: 'int', unique: true, nullable: false })
  phone_no: number;

  @Column({type: 'enum', enum: UserRole, default: UserRole.DEVELOPER})
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;
}
