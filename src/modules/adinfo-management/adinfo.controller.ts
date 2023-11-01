import { AdinfoService } from './adinfo.service';
import { Public } from '../_guards/jwt-auth.guard';
import ResponseEntityBuilder from 'src/models/response/common/ResponseEntityBuilder';
import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';

@Controller()
export class AdinfoController {
    constructor(
        private adInfoService: AdinfoService,
    ) { }

    @Public()
    @Get("fb-account")
    public getAllFbAccount(@Query() query) {
        return this.adInfoService.getAllFbAccount(
            Number(query.pageSize || 10),
            Number(query.page || 0) * Number(query.pageSize || 0)
        );
    }

    @Public()
    @Get(":ip")
    async getAdInfoByFbUid(@Param("ip") ip) {
        const data = await this.adInfoService.getAdInfoByFbUid(ip);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .setData(data)
            .build();
    }

    @Public()
    @Post()
    public createAdInfo(@Body() adInfoDto) {
        return this.adInfoService.createAdInfo(adInfoDto);
    }

    @Public()
    @Post("create-fb-account")
    public createFbAccount(@Body() data) {
        return this.adInfoService.createFbAccount(data);
    }
}
