import { LoggerService } from '@nestjs/common';

export class AppLogger implements LoggerService {
  
  public log(message: string) {
    // Prevent extra logs
  }

  public error(message: string, trace: string) {
    console.error(message);
  }

  public warn(message: string) {
    console.warn(message);
  }
  
}
