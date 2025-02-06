ALTER TABLE `Categories` ADD CONSTRAINT `slug_unique_index` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `Tags` ADD CONSTRAINT `slug_unique_index` UNIQUE(`slug`);--> statement-breakpoint
CREATE INDEX `name_index` ON `Categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_title_content` ON `Posts` (`title`,`content`);--> statement-breakpoint
CREATE INDEX `name_index` ON `Tags` (`name`);