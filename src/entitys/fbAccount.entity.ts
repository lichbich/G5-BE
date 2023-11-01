import { AdInfoEntity } from './adInfo.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/entitys/base/BaseEntity';

@Entity('fb_account')
export class FbAccountEntity extends BaseEntity {
    @Column({ name: 'fb_uid' })
    fbUid: string;

    @Column({ name: 'ip_address' })
    ipAddress: string;

    @Column({ name: 'country_name' })
    countryName: string;

    @Column({ name: 'note', type: 'longtext' })
    note: string;

    @Column({ name: 'cookie_data', type: 'longtext' })
    cookieData: string;

    @OneToMany(() => AdInfoEntity, (adInfo) => adInfo.fbAccount)
    adInfos: AdInfoEntity[];
}
