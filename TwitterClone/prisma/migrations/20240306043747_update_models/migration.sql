-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Twitt" DROP CONSTRAINT "Twitt_userid_fkey";

-- AddForeignKey
ALTER TABLE "Twitt" ADD CONSTRAINT "Twitt_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Twitt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
