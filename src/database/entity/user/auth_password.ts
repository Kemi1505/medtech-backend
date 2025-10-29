import { RoleType } from 'src/interfaces/db.enums';
import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'auth_passwords' })
export class Auth_Password {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Index()
  @Column({ nullable: false, default: 'USER'})
  role: RoleType;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  passwordToken: string|null;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date|null;

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