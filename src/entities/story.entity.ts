import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';


export enum StoryStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In_Progress',
  IN_TESTING = 'In_Testing',
  ACCEPTED = 'Accepted',
  DONE = 'Done',
}

@Entity()
export class StoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column()
  heading: string;

  @Column('text')
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  assignee: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  reporter: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StoryStatus,
    default: StoryStatus.TODO,
  })
  status: StoryStatus;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

}