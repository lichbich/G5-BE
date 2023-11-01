import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entitys/users.entity';

export class ChangeUserImageForm {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  image: string;
}
