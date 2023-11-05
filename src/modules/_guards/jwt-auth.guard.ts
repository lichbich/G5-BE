import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate, SetMetadata, UnauthorizedException } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflection: Reflector) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const isPublic = this.reflection.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getClass(),
            context.getHandler(),
        ])

        if (isPublic) return true;
        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_KEY });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request | any): string | undefined {
        return request.cookies.auth;
        // return type === 'Bearer' ? token : undefined;
    }
}
