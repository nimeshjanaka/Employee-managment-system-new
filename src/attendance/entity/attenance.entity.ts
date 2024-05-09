import { Role } from 'src/role/entity/role.entity';
import { User } from 'src/user/entity/user.entity';
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

@Entity('attendance')
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'in_time' })
  inTime: string;

  @Column({ name: 'out_time' })
  outTime: string;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'task' })
  task: string;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

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
