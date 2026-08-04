import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '@/auth/dtos/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('There is no user with that id!');
    }

    return user;
  }

  async findOneByEmail(email:string):Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(data:SignupDto):Promise<User>{
    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }

  async updatePassword(id:string,hashedPassword: string): Promise<void>{
    await this.userRepository.update(id, { password: hashedPassword });
  }

}
