import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8) // Assuming client number is exactly 8 digits
  clientNumber: string;

  @IsString()
  @IsNotEmpty()
  password_dont_send_to_client: string;
}
