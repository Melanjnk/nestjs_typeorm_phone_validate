import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PhoneValidator {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  countryName: string;

  // @see The Same Code could be in Different Countries
  @Column({ unique: false })
  code: string;

  // smallint = int2
  @Column("smallint", { array: true })
  requiredDigits: number[];

  @Column("smallint")
  min: number;

  @Column("smallint")
  max: number;

  @CreateDateColumn({ name: "created_at" })
  created: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated: Date;
}
