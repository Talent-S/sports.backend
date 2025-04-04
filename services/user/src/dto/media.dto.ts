import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class DocumentDto {
  @IsString()
  title: string;
  @IsString()
  issuedBy: string;
  @IsString()
  issuedDate: string;
  @IsString()
  @IsOptional()
  imageUrl: string;
  @IsEnum(['certificate', 'award'])
  type: 'certificate' | 'award';
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  userId: string;
}
