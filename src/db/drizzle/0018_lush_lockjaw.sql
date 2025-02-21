ALTER TABLE `NewsLetters` ADD CONSTRAINT `email_index` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD CONSTRAINT `verification_token_index` UNIQUE(`verification_token`);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD CONSTRAINT `status_index` UNIQUE(`status`);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD CONSTRAINT `verification_status_index` UNIQUE(`verification_status`);