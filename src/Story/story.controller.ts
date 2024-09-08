import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from 'src/dto/createStoryDto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { Roles } from 'src/Decorator/roleDecorator';
import { UserRole } from 'src/entities/user.entity';
import {
  DeveloperUpdateDto,
  ManagerUpdateDto,
  TesterUpdateDto,
} from 'src/dto/UpdateStoryDto';
import { AssigneeGuard } from '../Guards/assignee.guard';

@Controller('story')
@UseGuards(AuthGuard)
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Get()
  async all() {
    return this.storyService.get();
  }

  @Post('create')
  @Roles(UserRole.MANAGER)
  createStory(@Body() createStoryDto: CreateStoryDto, @Req() req: Request) {
    return this.storyService.create(createStoryDto, req);
 }
  

  @Get('filter')
  async getStoryByFilter(@Query() params:any): Promise<any> {
    return await this.storyService.filter(params);
  }

  @Get('history')
  getArchivedStories() {
    return this.storyService.getAssignedHistory();
  }
  
  @Get('my')
  async getMyStory(@Req() req: Request) {
    return await this.storyService.getMyStory(req);
  }

  @Get(':id')
  async getStory(@Param('id') id: string) {
    return await this.storyService.getOne(id);
  }

  @UseGuards(AssigneeGuard)
  @Put(':id')
  async updateDeveloper(@Param('id') id: string, @Body() updateStory: DeveloperUpdateDto | TesterUpdateDto | ManagerUpdateDto) {
    return await this.storyService.updateAssignee(id, updateStory);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  async delete(@Param('id') id: string) {
    await this.storyService.delete(id);
}
  
}
