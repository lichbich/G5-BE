import { Response } from 'express';
import { Public } from '../_guards/jwt-auth.guard';
import { CookieService } from 'src/service/cookie/cookie.service';
import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';

@Controller()
export class CookieController {
  constructor(private readonly cookieService: CookieService) { }

  @Get()
  public getAllIP(@Req() req, @Query() query) {
    const { user } = req;
    return this.cookieService.getAllIP(
      user.id,
      Number(query.pageSize || 10),
      Number(query.page || 0) * Number(query.pageSize || 0)
    );
  }

  @Get("/get-csv")
  async getCSV(@Res() res: Response) {
    const csv = await this.cookieService.getCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  }

  @Public()
  @Get("/get-extention-data")
  public getExtentionData(@Req() req, @Query() query) {
    const { user } = req;
    return this.cookieService.getExtentionData(
      user?.id,
      Number(query.pageSize || 10),
      Number(query.page || 0) * Number(query.pageSize || 0)
    );
  }

  @Get(':id')
  public setViewIP(@Param('id') id) {
    return this.cookieService.setViewIP(id);
  }

  @Delete(':id')
  public deleteIP(@Param('id') id) {
    return this.cookieService.deleteIP(id);
  }

  @Public()
  @Post("/send-extention-data")
  public sendExtentionData(@Body() cookie) {
    return this.cookieService.setExtentionData(cookie)
  }

  @Get("/get-extention-data/:id")
  public getAdsInfo(@Param('id') id) {
    return this.cookieService.getAdsInfo(id)
  }
}
