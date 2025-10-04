import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Conversation } from './Conversation';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Firebase UID used as primary identity linkage
  @Column({ type: 'varchar', length: 128, unique: true, nullable: true })
  firebaseUid?: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  photoUrl?: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  providerId?: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Conversation, conversation => conversation.user)
  conversations: Conversation[];
} 