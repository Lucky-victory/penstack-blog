ALTER TABLE `NewsLetters` MODIFY COLUMN `referrer` varchar(500);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD CONSTRAINT `NewsLetters_email_unique` UNIQUE(`email`);