import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createUserDto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async find(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
  async findDev(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
 
  async getAll(){
    const users = await this.userRepository.createQueryBuilder('user')
    .select(['user', 'user.id',
       'user.username',
       'user.first_name',
       'user.last_name',
       'user.email',
       'user.phone_no',
       'user.role',
       'user.created_at',
      ])
      .getMany()

      return users.map((user)=>{
        const {password, is_archived, deleted_at, ...userDto} = user
        return userDto;
      })
  }
  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
