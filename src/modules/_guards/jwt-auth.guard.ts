import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflection: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflection.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getClass(),
            context.getHandler(),
        ])

        if (isPublic) return true;
        return super.canActivate(context)
    }
}
