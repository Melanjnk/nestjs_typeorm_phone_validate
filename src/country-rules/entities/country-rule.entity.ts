import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CountryRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryTitle: string;

  @Column({ unique: true })
  countryCode: string;

  @Column('smallint', { array: true })
  requiredDigits: number[];

  @Column()
  min: number;

  @Column()
  max: number;
}
