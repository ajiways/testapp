import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ generated: 'increment', nullable: false })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
