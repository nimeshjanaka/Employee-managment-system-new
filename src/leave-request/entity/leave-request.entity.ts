import { LeaveRequestStatus } from 'src/common/enum/common.enum';
import { User } from 'src/user/entity/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Entity,
} from 'typeorm';

@Entity('')
export class LeaveRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fromDate: Date;

  @Column({ type: 'date' })
  toDate: Date;

  @Column({ name: 'reason' })
  reason: string;

  @Column({ name: 'status' })
  status: LeaveRequestStatus;

  @ManyToOne(() => User)
  @JoinColumn()
  employee: User;

  @ManyToOne(() => User)
  @JoinColumn()
  SuggestedCoworker: User;

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
