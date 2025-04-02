import { Controller, Get, Post } from '@nestjs/common';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function getRandomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

@Controller()
export class AppController {
  @Get()
  health(): string {
    return 'ok';
  }

  @Post()
  async healthPost() {
    const sec = getRandomBetween(0, 10);
    await delay(sec * 1000);
    return 'ok';
  }
}
