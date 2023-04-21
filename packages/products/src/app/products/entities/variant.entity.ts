import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('variants')
export class VariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  sku: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  weight: number;
  @Column({ nullable: true })
  weight_unit: string;
  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
