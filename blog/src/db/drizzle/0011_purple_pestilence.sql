ALTER TABLE `Medias` MODIFY COLUMN `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `SiteSettings` MODIFY COLUMN `created_at` timestamp DEFAULT '2025-01-19 23:12:40.781';--> statement-breakpoint
ALTER TABLE `SiteSettings` ADD CONSTRAINT `idx_key` UNIQUE(`key`);