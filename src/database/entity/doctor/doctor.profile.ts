import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department, Gender} from 'src/interfaces/db.enums';

@Entity({ name: 'doctor_profiles' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
    @Column({ nullable: false })
    doctorId: string;

  @Column({
      nullable: false,
      type: 'enum',
      enum: Department,
    })
    department: Department;
  
  @Column()
  fees: number;

  @Column({ nullable: false })
  gender: Gender;

  @Column({ nullable: false, type: 'timestamptz' })
  dateOfBirth: Date;

  @Column()
  createdBy: string;

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