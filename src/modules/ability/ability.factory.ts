import { Injectable } from "@nestjs/common";
import { User, UserRoles } from "src/entitys/users.entity";
import { Ability, InferSubjects } from "@casl/ability";
import { AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | "all";
export type AppAbility = Ability<[Action, Subjects]>;


@Injectable()
export class AbilityFactory {
    defineAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

        switch (user.role) {
            case UserRoles.SYSTEM_ADMIN:
                can(Action.Create, 'all')
                can(Action.Read, User)
                break;
            case UserRoles.ADMIN:
                can(Action.Create, 'all')
                can(Action.Read, User)
                break;
            case UserRoles.MEMBER:
                can(Action.Create, 'all')
                can(Action.Read, User)
                break;
            case UserRoles.MEMBER_V1:
                can(Action.Create, 'all')
                can(Action.Read, User)
                break;
            case UserRoles.MEMBER_V2:
                can(Action.Create, 'all')
                can(Action.Read, User)
                break;
            default:
                break;
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
