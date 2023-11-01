import { UserDto } from '../user/dtos/users.dto';
import { IPEntity } from 'src/entitys/ips.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Not, Repository } from 'typeorm';
import { handleSuccessRequest } from '../../models/common';
import { convertEntityToDto } from '../../utils/converts';
import { ReportsEntity } from 'src/entitys/reports.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserRoles, UserStatus } from 'src/entitys/users.entity';

@Injectable()
export class CookieManagementJobService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(IPEntity) private ipRepo: Repository<IPEntity>,
    @InjectRepository(ReportsEntity)
    private reportRepo: Repository<ReportsEntity>,
  ) { }

  async getAllIP(userId: string) {
    return await this.ipRepo.find({
      select: {
        cookieData: true,
      },
      where: {
        user: { id: userId },
        cookieData: Not(In(['[]', 'null'])),
        updatedAt: Between(
          new Date(new Date().setHours(-24, 0, 0, 0)),
          new Date(new Date().setHours(-1, 59, 0, 0))
        ),
      },
    });
  }

  async getAllMembers() {
    return this.userRepo
      .find({
        where: {
          role: UserRoles.MEMBER,
          status: UserStatus.ACTIVE,
          displayName: Like('%member%'),
        },
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

  mapData(data: Array<any>) {
    if (!data || data.length == 0) return [];
    const results: Array<any> = [];
    const browsers = Array.from(new Set(data.map((item: any) => item.browser)));
    const profiles = Array.from(new Set(data.map((item: any) => item.profile)));
    browsers.forEach((b) => {
      const tmpItem: Partial<any> = {};
      tmpItem['browser'] = b;

      profiles.forEach((p) => {
        tmpItem['profile'] = p;
        const groupItem = data.filter(
          (d) =>
            d.browser == b && d.profile == p && d.domain.includes('facebook'),
        );

        if (groupItem.length > 0) {
          results.push({
            browser: b,
            profile: p,
            cookies: groupItem,
          });
        }
      });
    });

    return results;
  }

  async CheckActiveAccount() {
    try {
      console.log('End');
    } catch (error) {
      console.log(error);
    }
  }
}
