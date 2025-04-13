import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  Max,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';

class BaseProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  socialLinks?: object;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  language?: string;
}

// Role-specific DTOs

// Team Profile DTO
export class TeamProfileDto extends BaseProfileDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;
}
// Artist Profile DTO
export class PlayerProfileDto extends BaseProfileDto {
  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  subProfession?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(110)
  age?: number;

  @IsOptional()
  @IsInt()
  birthYear?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsString()
  colour?: string;
}

// Expert Profile DTO (same structure as Artist for now, can be extended if needed)
export class ExpertProfileDto extends PlayerProfileDto {}

// Sponsor Profile DTO
export class SponsorProfileDto extends BaseProfileDto {
  @IsOptional()
  @IsString()
  company?: string;
}

// User Profile DTO
export class UserProfileDto extends BaseProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(110)
  age?: number;
}

export class AdminProfileDto extends BaseProfileDto {}
