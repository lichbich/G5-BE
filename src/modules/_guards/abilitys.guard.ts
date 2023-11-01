import { Reflector } from "@nestjs/core";
import { ForbiddenError } from "@casl/ability";
import { IS_PUBLIC_KEY } from "./jwt-auth.guard";
import { AbilityFactory } from "../ability/ability.factory";
import { CHECK_ABILITY, RequireRule } from "../_decorators/ability.decorator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler())
        const rules = this.reflector.get<RequireRule[]>(CHECK_ABILITY, context.getHandler()) || [];
        
        if (isPublic) return true;

        const { user } = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.defineAbility(user);

        try {
            return rules.every(rule => ability.can(rule.action, rule.subject));
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
        }
    }
}