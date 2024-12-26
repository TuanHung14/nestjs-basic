import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Dùng OmitType để ngoại trừ update password
export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {}
