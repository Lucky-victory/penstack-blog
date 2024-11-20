ALTER TABLE `Users` MODIFY COLUMN `auth_id` varchar(100) DEFAULT '131699463806781489152';--> statement-breakpoint
ALTER TABLE `Posts` ADD `scheduled_at` timestamp;--> statement-breakpoint
ALTER TABLE `Posts` ADD `schedule_id` varchar(50);