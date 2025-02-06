DROP INDEX IF EXISTS `idx_title_content` ON `Posts`;--> statement-breakpoint
CREATE INDEX `idx_title` ON `Posts` (`title`);