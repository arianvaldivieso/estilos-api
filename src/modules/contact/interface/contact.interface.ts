import { User } from 'modules/users/entities/user.entity';

export interface CustomContact {
  id: number;
  position: number;
  user: User;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}
