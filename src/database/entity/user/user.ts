import { AuthModule } from 'src/auth/auth.module';
import { AuthMethod, RoleType } from 'src/interfaces/db.enums';
import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { nullable } from 'zod';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ nullable: false })
  phoneNumber: string;

  @Index({ unique: true })
  @Column({ nullable: false })
  email: string;

  @Index({ unique: false })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phoneVerified?: boolean;

  @Column({ nullable: true })
  emailVerified?: boolean;

  @Column({ nullable: false, length: 50 })
  firstName: string;

  @Column({ nullable: false, length: 50 })
  lastName: string;

  @Column({nullable: false, default: RoleType.USER})
  role?: RoleType;

  @Column({nullable: false, default: AuthMethod.EMAIL_AND_PASSWORD})
  authType?: AuthModule

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
