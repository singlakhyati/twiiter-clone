import { PrismaClient, User, Twitt } from '@prisma/client';

// Extend PrismaClient to include custom types if necessary
interface CustomPrismaClient extends PrismaClient {
    userWithTweets: User & { twitts: Twitt[] };
}

declare const prisma: CustomPrismaClient;

export { User, Twitt };