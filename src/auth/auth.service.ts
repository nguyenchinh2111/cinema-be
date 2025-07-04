/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  // In a real application, this would come from a database
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@cinema.com',
      password: '$2a$10$YourHashedPasswordHere', // 'admin123' hashed
      role: 'admin',
    },
    {
      id: 2,
      username: 'user',
      email: 'user@cinema.com',
      password: '$2a$10$YourHashedPasswordHere', // 'user123' hashed
      role: 'user',
    },
  ];

  constructor(private jwtService: JwtService) {
    // Hash default passwords
    void this.hashDefaultPasswords();
  }

  private async hashDefaultPasswords() {
    this.users[0].password = await bcrypt.hash('admin123', 10);
    this.users[1].password = await bcrypt.hash('user123', 10);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        username: user.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        email: user.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        role: user.role,
      },
    };
  }

  validateToken(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = this.users.find((u) => u.id === payload.sub);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }
}
