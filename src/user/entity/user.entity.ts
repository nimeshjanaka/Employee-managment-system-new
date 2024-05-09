import { Role } from 'src/role/entity/role.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'nic' })
  nic: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'tel_no' })
  telNo: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'is_permanent',default:false })
  is_permanent: boolean;


  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;

   @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
