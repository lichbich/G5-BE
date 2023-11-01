import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdinfoService } from './adinfo.service';
import { IPEntity } from 'src/entitys/ips.entity';
import { AdinfoController } from './adinfo.controller';
import { AdInfoEntity } from 'src/entitys/adInfo.entity';
import { FbAccountEntity } from 'src/entitys/fbAccount.entity';

@Module({
    imports: [TypeOrmModule.forFeature(
        [AdInfoEntity, IPEntity, FbAccountEntity]
    )],
    controllers: [AdinfoController],
    providers: [AdinfoService],
    exports: [],
})
export class AdinfoModule { }
