import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VariantEntity } from './variant.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false, unique: true })
  name: string;
  @Column('text')
  type: string;
  @Column('simple-array')
  categories: string[];
  @Column('text')
  status: string;
  @OneToMany(() => VariantEntity, (variant) => variant.product)
  variants: VariantEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
