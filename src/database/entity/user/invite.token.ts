import { AdminPermission, Department, RoleType } from 'src/interfaces/db.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'invite_tokens' })
export class InviteToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  token: string

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, length: 50 })
  firstName: string;
  
  @Column({ nullable: false, length: 50 })
  lastName: string;

  @Column('simple-array', { nullable: true })
  permissions: AdminPermission[];

  @Column({
    nullable: true,
    type: 'enum',
    enum: Department,
  })
  department: Department;

  @Column({ nullable: false })
  invitedBy: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: RoleType,
  })
  role: RoleType;

  @Column({ nullable: true })
  isUsed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

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