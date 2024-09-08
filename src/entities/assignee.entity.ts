import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { StoryEntity, StoryStatus } from './story.entity';

@Entity()
export class AssigneeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoryEntity, (story) => story.id)
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  assignee: UserEntity;
  
  @Column({
    type: 'enum',
    enum: StoryStatus,
  })
  status: StoryStatus;
  
  @CreateDateColumn()
  changedAt: Date;
}