import crypto from 'crypto';
import { DataSource, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../service/user/dtos/createUser.dto';
import { convertEntityToDto } from 'src/utils/converts';
import { ChangePasswordDTO } from '../../service/user/dtos/changePassword.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { MailService } from '../_mailer/mail.service';
import { LoginDto } from 'src/models/request/LoginDto';
import { SignUpDto } from 'src/models/request/SignUpDto';
import { handleSuccessRequest } from 'src/models/common';
import { UserDto } from '../../service/user/dtos/users.dto';
import { generateOTP, generatePassword, generateRandomString } from 'src/utils/number';
import { User, UserRoles, UserStatus } from 'src/entitys/users.entity';

enum messages {
  ACCOUNT_IS_NOT_EXIST = 'Your account is not exist!',
  INCORRECT_INFORMATION = 'Incorrect email or password!',
  IN_ACTIVE_ACCOUNT = 'Your account is currently inactive!',
  DISABLE_ACCOUNT = 'Your account is currently disable!',
  USER_ACTIVE_SUCCESS = 'User active success.',
  USER_ACTIVE_FAIL = 'User active fail.',
  SEND_ACTIVE_LINK_SUCCESS = 'Send active link success.',
}

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    @InjectRepository(User) private usersRepo: Repository<User>
  ) { }

  async login({ email, password }: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email, password } });

    if (user && user.status === UserStatus.ACTIVE) {
      return convertEntityToDto(user, new UserDto());
    } else if (user && user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException(messages.IN_ACTIVE_ACCOUNT);
    }

    const countUser = await this.usersRepo.count({ where: { email: email } });

    if (countUser > 0) {
      throw new BadRequestException(messages.INCORRECT_INFORMATION);
    } else {
      throw new BadRequestException(messages.ACCOUNT_IS_NOT_EXIST);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new User();
      const verifyCode = generateOTP(6);

      user.displayName = signUpDto.displayName;
      user.email = signUpDto.email;
      user.password = signUpDto.password;
      user.address = signUpDto.address;
      user.role = UserRoles.MEMBER;
      user.status = UserStatus.IN_ACTIVE;
      user.activeToken = JSON.stringify({ code: verifyCode });
      // send verify code

      const newUser = await queryRunner.manager.save(user);

      await this.sendVerifyCode(user, verifyCode);
      await queryRunner.commitTransaction();
      return convertEntityToDto(newUser, new UserDto());
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async sendVerifyEmail(email: string) {
    const verifyCode = generateOTP(6);
    const user = await this.usersRepo.findOneBy({ email });

    if (!user || user.status != UserStatus.IN_ACTIVE) {
      throw new BadRequestException("Something wrong!");
    }

    user.activeToken = JSON.stringify({ code: verifyCode });
    await this.usersRepo.save(user);

    return this.sendVerifyCode(user, verifyCode);
  }

  async sendVerifyCode(user: User, code: string) {
    const to = user.email,
      subject = "Verify your email address",
      context = {
        verifyCode: code,
        userName: user.displayName,
      },
      template = "verifyCode";

    return this.mailService.sendMail(to, subject, context, template);
  }

  async verifyCode(userId: string, verifyCode: String) {
    try {
      const targetUser = await this.usersRepo.findOneBy({ id: userId });
      if (!targetUser) throw new BadRequestException(messages.ACCOUNT_IS_NOT_EXIST);
      if (targetUser.status === UserStatus.ACTIVE) throw new BadRequestException("Your account is active currently!");

      const activeToken = JSON.parse(targetUser.activeToken);
      const isValidCode = verifyCode == activeToken.code;
      // const isValidTime = verifyCode == activeToken.time; //TODO
      if (!isValidCode) throw new BadRequestException("Verify code is incorect!");

      targetUser.status = UserStatus.ACTIVE;
      return this.usersRepo.save(targetUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendFogotPasswordCode(email: string) {
    try {
      const verifyCode = generateOTP(6);
      const user = await this.usersRepo.findOneBy({ email });

      if (!user) throw new BadRequestException(messages.ACCOUNT_IS_NOT_EXIST);
      if (user && user.status == UserStatus.IN_ACTIVE) throw new BadRequestException("Your account is inactive currently!");
      user.fogotPasswordCode = JSON.stringify({ code: verifyCode });
      await this.usersRepo.save(user);

      const to = user.email,
        subject = "Verify fogot passwrod code",
        context = {
          verifyCode: verifyCode,
          userName: user.displayName,
        },
        template = "verifyCode";

      return this.mailService.sendMail(to, subject, context, template);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyFogotPasswordCode(email: string, code: string) {
    try {
      const targetUser = await this.usersRepo.findOneBy({ email });
      if (!targetUser) throw new BadRequestException(messages.ACCOUNT_IS_NOT_EXIST);
      if (targetUser && targetUser.status == UserStatus.IN_ACTIVE)
        throw new BadRequestException("Your account is inactive currently!");

      const activeToken = JSON.parse(targetUser.fogotPasswordCode);
      const isValidCode = code == activeToken.code;
      if (!isValidCode) throw new BadRequestException("Verify code is incorect!");
      const newPasswrod = generateRandomString(10);
      targetUser.password = newPasswrod;
      await this.usersRepo.save(targetUser);

      const to = targetUser.email,
        subject = "Your new password!",
        context = {
          verifyCode: newPasswrod,
          userName: targetUser.displayName,
        },
        template = "fogotPassword";

      return this.mailService.sendMail(to, subject, context, template);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllUsers() {
    const listUser = await this.usersRepo.find({
      where: { status: UserStatus.ACTIVE },
    });
    return listUser.map((user) => convertEntityToDto(user, new UserDto()));
  }

  async getAllMembers() {
    return this.usersRepo
      .find({
        where: {
          role: UserRoles.MEMBER,
          status: UserStatus.ACTIVE,
          displayName: Like('%member%'),
        },
        relations: ['reports'],
      })
      .then((res) => {
        let listUsers = [];
        listUsers = res.map((user) => convertEntityToDto(user, new UserDto()));
        return handleSuccessRequest(listUsers);
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  async createUser(userDto: CreateUserDto) {
    const createUser = new User();
    createUser.displayName = userDto.displayName;
    createUser.email = userDto.email;
    createUser.password = userDto.password;
    createUser.phone = userDto.phone;
    createUser.address = userDto.address;
    createUser.language = userDto.language;
    createUser.role = UserRoles.MEMBER;
    createUser.status = UserStatus.ACTIVE;

    return this.usersRepo
      .save(createUser)
      .then((res) =>
        handleSuccessRequest(convertEntityToDto(createUser, new UserDto())),
      )
      .catch((err) => {
        throw new HttpException(messages.INCORRECT_INFORMATION, HttpStatus.BAD_REQUEST);
      });
  }

  async changePassword(user: User, changepassworddto: ChangePasswordDTO) {
    const oldUser = await this.usersRepo.findOne({ where: { id: user.id } });
    const newUser = this.usersRepo.merge(oldUser, {
      password: changepassworddto.password,
    });

    return this.usersRepo
      .save(newUser)
      .then((res) => handleSuccessRequest({}))
      .catch((err) => {
        throw new HttpException(
          messages.INCORRECT_INFORMATION,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async changeMemberPassword(userId: string, newPasswrod: any) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    user.password = newPasswrod;
    return this.usersRepo
      .save(user)
      .then((res) => handleSuccessRequest(res))
      .catch((err) => {
        throw new HttpException(
          messages.INCORRECT_INFORMATION,
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
