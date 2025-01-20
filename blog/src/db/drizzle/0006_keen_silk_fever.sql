ALTER TABLE `Users` MODIFY COLUMN `auth_id` varchar(100);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `status` varchar(255) DEFAULT 'subscribed' NOT NULL;--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `verification_status` varchar(255) DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `verification_token` varchar(255);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `verification_token_expires` timestamp;--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `unsubscribed_at` timestamp;