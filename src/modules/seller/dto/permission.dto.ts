import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PermissionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  permissionId: number;
}
