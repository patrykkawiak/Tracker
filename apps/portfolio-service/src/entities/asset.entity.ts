import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  ticker: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ type: 'varchar', nullable: true })
  type: string; // 'stock', 'crypto', 'cash', etc.

  @CreateDateColumn()
  createdAt: Date;
}

