import { Injectable, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { request } from 'express';
import { CreateStoryDto } from 'src/dto/createStoryDto';
import {
  DeveloperUpdateDto,
  TesterUpdateDto,
  ManagerUpdateDto,
} from 'src/dto/UpdateStoryDto';
import { AssigneeHistory } from 'src/entities/assignee.entity';
import { StoryEntity, StoryStatus } from 'src/entities/story.entity';
import { UserEntity } from 'src/entities/user.entity';
import { DeepPartial, Entity, Repository } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private jwtService: JwtService,
    @InjectRepository(AssigneeHistory)
    private assigneeHistoryRepository: Repository<AssigneeHistory>,
  ) {}

  private buildStoryQuery() {
    return this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.assignee', 'assignee')
      .leftJoinAndSelect('story.reporter', 'reporter')
      .select([
        'story.id',
        'story.heading',
        'story.body',
        'story.status',
        'story.createdAt',
        'assignee.id',
        'assignee.username',
        'assignee.fist_name',
        'assignee.last_name',
        'assignee.email',
        'assignee.phone_no',
        'assignee.role',
        'assignee.created_at',
        'reporter.id',
        'reporter.username',
        'reporter.first_name',
        'reporter.last_name',
        'reporter.email',
        'reporter.phone_no',
        'reporter.role',
        'reporter.created_at',
      ]);
  }

  private assigneeHistoryQuery() {
    return this.assigneeHistoryRepository
      .createQueryBuilder('AssigneeHistory')
      .leftJoinAndSelect('AssigneeHistory.story', 'story')
      .leftJoinAndSelect('AssigneeHistory.assignee', 'assignee')
      .select([
        'AssigneeHistory.id',
        'AssigneeHistory.status',
        'AssigneeHistory.changedAt',
        'story.id',
        'story.heading',
        'assignee.id',
        'assignee.username',
      ])
      .orderBy('AssigneeHistory.changedAt', 'ASC')
      .getMany();
  }

  async get(): Promise<StoryEntity[]> {
    const story = await this.storyRepository.find();
    return story;
  }

  async getMyStory(req: any) {
    const verifiedToken = req['user'];

    const story = await this.storyRepository
      .createQueryBuilder('story')
      .select([
        'story',
        'assignee.id',
        'assignee.username',
        'assignee.role',
        'assignee.email',
      ])
      .leftJoin('story.assignee', 'assignee')
      .where('assignee.id = :id', { id: verifiedToken.id })
      .getOne();
    return story;
  }

  async getOne(id: string) {
    return await this.buildStoryQuery()
      .where('story.id = :id', { id })
      .getOne();
  }

  async create(
    storyData: CreateStoryDto,
    req: any,
  ): Promise<
    Pick<
      StoryEntity,
      | 'id'
      | 'heading'
      | 'body'
      | 'status'
      | 'reporter'
      | 'createdAt'
      | 'updatedAt'
    >
  > {
    const verifiedToken = req['user'];

    const story = this.storyRepository.create({
      ...storyData,
      reporter: verifiedToken.id,
    });

    const result = await this.storyRepository.save(story);
    await this.logAssigneeHistory(story.id, story.assignee, story.status);
    return {
      id: result.id,
      heading: result.heading,
      body: result.body,
      status: result.status,
      reporter: result.reporter,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async updateAssignee(
    id: string,
    updateStory: DeveloperUpdateDto | TesterUpdateDto | ManagerUpdateDto,
  ) {
    const updateData = {
      ...updateStory,
      status: updateStory.status as StoryStatus,
    };
    const story = await this.storyRepository.update({ id }, updateData);
    await this.logAssigneeHistory(id, updateStory.assignee, updateStory.status);
    return story;
  }

  async filter(params: any): Promise<StoryEntity[]> {
    const query = this.buildStoryQuery();

    // if no query parameters are provided, return all stories
    if (Object.keys(params).length === 0) {
      return await query.getMany();
    }
    if (params.assigneeId) {
      query.andWhere('assignee.id = :assigneeId', {
        assigneeId: params.assigneeId,
      });
    }
    if (params.reporterId) {
      query.andWhere('reporter.id = :reporterId', {
        reporterId: params.reporterId,
      });
    }
    if (params.status) {
      query.andWhere('story.status = :status', { status: params.status });
    }
    return await query.getMany();
  }

  async getAssignedHistory() {
    return await this.assigneeHistoryQuery();
  }

  private async logAssigneeHistory(
    story: string,
    assignee: UserEntity,
    status: string,
  ): Promise<any> {
    const history = this.assigneeHistoryRepository.create({
      story,
      assignee,
      status,
    } as DeepPartial<AssigneeHistory>);
    await this.assigneeHistoryRepository.save(history);
  }

  delete(id: string) {
    return this.storyRepository
      .createQueryBuilder('Story')
      .update(StoryEntity)
      .set({ isArchived: true })
      .where('id = :id', { id })
      .execute();
  }
}
