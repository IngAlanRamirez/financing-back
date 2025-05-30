import { IsArray, IsString, IsIn, ArrayNotEmpty, IsUUID } from 'class-validator';

export class DeferralRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true }) // Validate each element as a UUID
  purchaseIds: string[];

  @IsIn([3, 6, 9, 12, 18, 24])
  deferralMonths: 3 | 6 | 9 | 12 | 18 | 24;
}
