import { SetMetadata } from "@nestjs/common";
import { User } from "src/entitys/users.entity";
import { Action, Subjects } from "../ability/ability.factory";

export interface RequireRule {
    action: Action,
    subject: Subjects
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbility = (...requirements: RequireRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements)

export class ReadUserAbility implements RequireRule {
    subject = User;
    action = Action.Read;

    constructor(action) {
        this.action = action;
    }
}