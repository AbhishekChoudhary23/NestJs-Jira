import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoryService } from '../Story/story.service';
import { UsersService } from 'src/Users/users.service';
import { ManagerUpdateDto } from 'src/dto/UpdateStoryDto';
import { UserRole } from 'src/entities/user.entity';
import { StoryStatus } from 'src/entities/story.entity';
import { checkRole } from 'src/utils/checkRole';
import { checkStatusTransition } from 'src/utils/checkStatusTransition';

@Injectable()
export class AssigneeGuard implements CanActivate {
  constructor(
      private jwtService: JwtService,
      private storyService: StoryService,
      private userService: UsersService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'].replace('Bearer ', '');
    const payload = await this.jwtService.verifyAsync(token, {
      secret: "My_spcial_secret_token",
    });
    request['user'] = payload;

    //checking if the person is developer or not
    const updateStory: any = request.body;
    const role = await this.userService.findDev(updateStory.assignee);
    if(!role){
        throw new ForbiddenException('assignee not found.')
    }
    const {id} = request.params;
    const story = await this.storyService.getOne(id);
    if (!story) {
      throw new ForbiddenException('Story not found.');
    }
    const currentStatus = story.status;
    
    // Main logic
    switch (payload.role) {
      case UserRole.DEVELOPER:
        checkRole(role.role, UserRole.TESTER);
        checkStatusTransition(payload.role, currentStatus, updateStory.status);
        return true;
      case UserRole.TESTER:
        checkRole(role.role, UserRole.MANAGER || UserRole.DEVELOPER);
        checkStatusTransition(payload.role, currentStatus, updateStory.status);
        return true;
      case UserRole.MANAGER:
        checkRole(role.role, UserRole.MANAGER || UserRole.DEVELOPER || UserRole.TESTER);
        checkStatusTransition(payload.role, currentStatus, updateStory.status);
        if (updateStory.status === StoryStatus.DONE) {
          story.assignee = null;
          const updateDto: ManagerUpdateDto = {
            assignee: null,
          }
          await this.storyService.updateAssignee(id, updateDto);
        }
        return true;
      default:
        throw new ForbiddenException('You do not have permission to perform this action.');
    }
  }

}
