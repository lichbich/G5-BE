import { Column, Entity, ManyToOne } from 'typeorm';
import { FbAccountEntity } from './fbAccount.entity';
import { BaseEntity } from 'src/entitys/base/BaseEntity';

@Entity('adinfo')
export class AdInfoEntity extends BaseEntity {
    @Column()
    status: string;
    @Column()
    name: string;
    @Column()
    surplus: string;
    @Column()
    threshold_amount: string;
    @Column()
    limit: string;
    @Column()
    total: string;
    @Column()
    currency: string;

    @ManyToOne(() => FbAccountEntity, (fbAccount) => fbAccount.adInfos)
    fbAccount: FbAccountEntity;
}
