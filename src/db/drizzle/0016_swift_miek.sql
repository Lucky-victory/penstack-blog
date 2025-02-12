DROP TABLE `PostViewStats`;--> statement-breakpoint
DROP INDEX `idx_title` ON `Posts`;--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `summary` varchar(500);--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `post_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_post_id_unique` UNIQUE(`post_id`);--> statement-breakpoint
ALTER TABLE `Posts` ADD CONSTRAINT `idx_post_id` UNIQUE(`post_id`);--> statement-breakpoint
ALTER TABLE `Posts` ADD `send_newsletter` boolean DEFAULT true;--> statement-breakpoint
CREATE INDEX `idx_status` ON `Comments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_seo_title` ON `PostSeoMeta` (`title`);--> statement-breakpoint
CREATE INDEX `idx_seo_canonical_url` ON `PostSeoMeta` (`canonical_url`);--> statement-breakpoint
CREATE INDEX `idx_title_summary` ON `Posts` (`title`,`summary`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `Posts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `Replies` (`status`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `Permissions` (`name`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `Roles` (`name`);